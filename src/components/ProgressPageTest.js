import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import {ChartRow, LabelAxis, Charts, Baseline,
    ValueAxis, ChartContainer, Resizable,
    Brush, YAxis, BarChart, Legend, styler} from 'react-timeseries-charts';
import { TimeSeries, avg, sum, Index, filter, TimeRange} from 'pondjs';
import "moment-duration-format";
import moment from "moment";
import Grid from '@material-ui/core/Grid';

const style = styler([
    { key: "calories", color: "#f9bf8e" },
    { key: "carbs", color: "#d9f495" },
    { key: "fat", color: "#fff58c" },
    { key: "protein", color: "f7978a"}
]);

// these are the names of the nutrients as specified in MongoDB 
// with associated metadata 
const channels = {
    calories: { units: "kcal", label: "Calories", format: "d", show: true, goal: null,
        dailyseries: null, weeklyseries: null, monthlyseries: null, subseries: null },
    carbs: { units: "g", label: "Carbohydrates", format: "d", show: true, goal: null,
        dailyseries: null, weeklyseries: null, monthlyseries: null, subseries: null },
    fat: { units: "g", label: "Fat", format: "d", show: true, goal: null,
        dailyseries: null, weeklyseries: null, monthlyseries: null, subseries: null },
    protein: { units: "g", label: "Protein", format: "d", show: true, goal: null,
        dailyseries: null, weeklyseries: null, monthlyseries: null, subseries: null }
}

// these are the names of the nutrients as specified in MongoDB 
const channelNames = ['protein', 'fat', 'carbs', 'calories']

// // Rollups we'll generate to reduce data for the screen
// const rollupLevels = ["1d", "3d", "5d", "7d"];

class ProgressPage extends React.Component {

    state = {
        ready: false,
        channels: channels,
        tracker: null,
        timerange: null,
        totalrange: null,
        totalseries: null,
        trackerIdx: null,
        maxHeight: null,
        windowSize: 'day',
        mintime: null,
        maxtime: null
    };

    componentDidMount() {

        // allows for async call 
        setTimeout(() => {

             // get calorie goal from server 
             axios.get(
                'http://127.0.0.1:5000/api/get_user_nutrition_goals',
                {
                    params: {
                    user_id: `${this.props.match.params.id}`
                }},
                {
                    headers: {'Content-type': 'application/json'}
                }
            ).then((response) => {
                let data = response['data'];
                console.log(data)
                
                // add goal data according to API-specified order 
                channels['calories'].goal = data[0];
                channels['protein'].goal = data[1];
                channels['fat'].goal = data[2];
                channels['carbs'].goal = data[3];

            });

            // get nutrient progress from server, then render 
            axios.get(
                'http://127.0.0.1:5000/api/get_user_nutrient_progress_all_dummy',
                {
                    params: {
                    user_id: `${this.props.match.params.id}`
                }},
                {
                    headers: {'Content-type': 'application/json'}
                }
            ).then((response) => {
                let data = response['data'];
                
                // process data into appropriate channels

                const points = {};
                channelNames.map(channelName => {
                    points[channelName] = [];
                });

                _.forEach(data, (response_nutrients, response_date) => {
                    // assumes date string is provided in UTC time  
                    // 1 day is needed to be added for the rollups to work 
                    // properly (they currently do not support utc time)
                    // so UTC 12 am is one day less 
                    const d = moment(response_date).add(1, 'days').toDate();
                    const index = Index.getIndexString("1d", d)
                    channelNames.map(channelName => {
                        points[channelName].push([index, response_nutrients[channelName]]);
                    });
                });

                // make the TimeSeries here from points collected above
                channelNames.map(channelName => {

                    // The TimeSeries itself, for this channel
                    const initialseries = new TimeSeries({
                        name: channelName,
                        columns: ["index", channelName],
                        points: points[channelName]
                    });

                    // // rollup 
                    // const rollups = rollupLevels.map(rollupLevel => {
                    //     return {
                    //         duration: moment.duration(parseInt(rollupLevel[0]), rollupLevel[1]),
                    //         series: initialseries.fixedWindowRollup({
                    //             windowSize: rollupLevel,
                    //             aggregation: { [channelName]: { [channelName]: avg() } }
                    //         })
                    //     };
                    // });

                    // // Rollup series levels
                    // channels[channelName].rollups = rollups;

                    // rollups 
                    let dailyseries = initialseries.dailyRollup({
                        //windowSize: "1d",
                        aggregation: {[channelName]: {[channelName]: avg(filter.ignoreMissing)}}
                    });

                    let weeklyseries = dailyseries.fixedWindowRollup({
                        windowSize: "7d",
                        aggregation: {[channelName]: {[channelName]: avg(filter.ignoreMissing)}}
                    });

                    let monthlyseries = dailyseries.monthlyRollup({
                        aggregation: {[channelName]: {[channelName]: avg(filter.ignoreMissing)}}
                    });
                    
                    // converts series back to UTC format as rollups revert that 

                    dailyseries = TimeSeries.timeSeriesListMerge({
                        seriesList: [dailyseries]
                    });

                    weeklyseries = TimeSeries.timeSeriesListMerge({
                        seriesList: [weeklyseries]
                    });

                    monthlyseries = TimeSeries.timeSeriesListMerge({
                        seriesList: [monthlyseries]
                    });

                    // Raw series
                    channels[channelName].dailyseries = dailyseries;
                    channels[channelName].weeklyseries = weeklyseries;
                    channels[channelName].monthlyseries = monthlyseries;
                    channels[channelName].subseries = dailyseries;

                    // Some simple statistics for each channel
                    channels[channelName].max = parseInt(dailyseries.max(channelName), 10);
                }); 
                
                // represent the entirety of the data for bottom barchart 
                const totalseries = TimeSeries.timeSeriesListMerge({
                     seriesList: channelNames.map(channelName => 
                        channels[channelName].dailyseries)
                 });

                 // get the max sum for the barchart 
                 // for the total series display 
                const sumseries = totalseries.collapse({
                    name: "sum",
                    reducer:  sum(), 
                    fieldSpecList: channelNames
                });
                const maxHeight = sumseries.max('sum');

                // represents range of entire loaded series 
                let totalrange = totalseries.range(); 

                const mintime = moment(totalrange.begin()).utc().startOf('day');
                const maxtime = moment(totalrange.end()).utc().endOf('day');

                totalrange = new TimeRange(mintime, maxtime);

                this.setState(() => ({ ready: true, channels, maxHeight, 
                    timerange: totalrange, totalrange, totalseries, mintime, maxtime}));

            });

        }, 0);
    };

    handleTrackerChanged = (t) => {
        const { channels, windowSize, timerange } = this.state

        let trackerIdx = null;

        let series = null; 
        let channelName = channelNames[0];
        if (windowSize === 'day') {
            series = channels[channelName].dailyseries;
        } else if (windowSize === 'week') {
            series = channels[channelName].weeklyseries;
        } else if (windowSize === 'month') {
            series = channels[channelName].monthlyseries;
        }

        // make sure tracker is within brush range for display 
        if (t >= timerange.begin() && t <= timerange.end()) {
            trackerIdx = series.bisect(new Date(t));
            this.setState(() => ({ tracker: t, trackerIdx }));
        } else {
            this.setState(() => ({ tracker: null, trackerIdx: null }));
        }
    };

    // Handles when the brush changes the timerange
    handleTimeRangeChange = (timerange) => {
        const { channels, windowSize, tracker, mintime, maxtime } = this.state;

        if (timerange) {

            // Note this code works as long as the minimum time
            // unit is in terms of days within the supplied data 

            // snap time range to days 
            const rangebegin = moment(timerange.begin()).utc();
            const rangeend = moment(timerange.end()).utc();

            // get start of the day from the range 
            let daystart = null
            if (rangebegin.isSameOrBefore(mintime)) { // lower bound 
                daystart = mintime;
            } else if (rangebegin.isSameOrAfter(maxtime)) { // upper bound 
                daystart = maxtime.clone().subtract(1, 'days');
            } else {
                daystart = rangebegin.clone().startOf('day');
            }

            // get end of the day from the range 
            let dayend = null
            if (rangeend.isSameOrAfter(maxtime)) { // upper bound 
                dayend = maxtime
            } else if (rangeend.isSameOrBefore(mintime)) { // lower bound 
                dayend = mintime.clone().add(1, 'days');
            } else {
                dayend = rangeend.clone().startOf('day');
            }

            // make sure dayend is at least a day greater than start end 
            // erasing this becomes an issue during zooming too close 
            if (dayend.isSameOrBefore(daystart.clone().add(1, 'days'))) {
                dayend = daystart.clone().add(1, 'days');
            }

            //let adjustedrange = new TimeRange(daystart, dayend);

            // get beginning and ending position for indexing 
            // optimization: slice faster than crop 
            let timerangeBegin = daystart.toDate();
            let timerangeEnd = dayend.toDate();
            let channelName = channelNames[0];
            let initseries = channels[channelName].dailyseries;
            let beginPos = initseries.bisect(timerangeBegin);
            const bisectedEventOutsideRange = initseries.at(beginPos).timestamp() < timerangeBegin;
            beginPos = bisectedEventOutsideRange ? beginPos + 1 : beginPos;
            let endPos = initseries.bisect(timerangeEnd, beginPos); 
            
            // set subseries
            channelNames.map(channelName => {
                channels[channelName].subseries = 
                    channels[channelName].dailyseries.slice(beginPos, endPos);
            });

            this.setState({ channels, timerange: new TimeRange(daystart, dayend)});
                
        } else {
            this.setState({ timerange: this.state.totalrange });
        }
    };

    handleChartResize = (width) => {
        this.setState({ width });
    };

    // // get time axis tick formats 
    // getTimeFormat = (timerange) => {
    //     if (moment.duration(timerange.duration()).asMonths() < 12) {
    //         if (moment.duration(timerange.duration()).asDays() < 30 ) {
    //             return 'day';
    //         } else {
    //             return 'month';
    //         }
    //     } else {
    //         return 'year';
    //     }
    // }

    renderChart = () => {
        return this.renderChannelsChart();
    };

    renderChannelsChart = () => {
        const { channels, tracker, trackerIdx, timerange, mintime, maxtime, windowSize } = this.state;

        const rows = [];

        // determine which channels to display 
        const displayChannels = channelNames.filter(channelName => {
            if (channels[channelName].show) {
                return true;
            } else {
                return false;
            }
        })
        
        displayChannels.map(channelName => {

            let series = null; 
            if (windowSize === 'day') {
                series = channels[channelName].dailyseries;
            } else if (windowSize === 'week') {
                series = channels[channelName].weeklyseries;
            } else if (windowSize === 'month') {
                series = channels[channelName].monthlyseries;
            }
            let subseries = channels[channelName].subseries;

            const charts = [];
            charts.push(
                <BarChart
                    key={`bar-${channelName}`}
                    axis={`${channelName}_axis`}
                    series={series}
                    columns={[channelName]}
                    style={style}
                    breakLine={true}
                    minBarHeight={0}
                />     
            );

            // Get the value at the current tracker position for the ValueAxis
            let value = "--";
            if (trackerIdx !== null) {
                value = parseInt(series.at(trackerIdx).get(channelName), 10);
            }

            // Get the summary values for the LabelAxis
            const summary = [
                { label: "Min", value: parseInt(subseries.min(channelName), 10) },
                { label: "Max", value: parseInt(subseries.max(channelName), 10) },
                { label: "Avg", value: parseInt(subseries.avg(channelName), 10) }
            ];

            const containerHeight = 350;

            rows.push(
                <ChartRow
                    height={containerHeight / displayChannels.length}
                    key={`row-${channelName}`}
                >
                    <LabelAxis
                        id={`${channelName}_axis`}
                        label={channels[channelName].label}
                        values={summary}
                        min={0}
                        max={channels[channelName].max}
                        width={140}
                        type="linear"
                        format="d"
                    />
                    <Charts>
                        {charts}
                        <Baseline
                            key={`line-${channelName}`}
                            axis={`${channelName}_axis`}
                            value={channels[channelName].goal}
                            label={`Goal: ${parseInt(channels[channelName].goal)}`}
                        />
                    </Charts>
                    <ValueAxis
                        id={`${channelName}_valueaxis`}
                        value={value}
                        detail={channels[channelName].units}
                        width={80}
                        min={0}
                        max={0} // ??
                    />
                </ChartRow>
            );

        });

        return (
            <ChartContainer
                timeRange={timerange}
                utc={true}
                timeAxisTickCount={2}
                trackerPosition={tracker}
                onTimeRangeChanged={this.handleTimeRangeChange}
                onChartResize={width => this.handleChartResize(width)}
                onTrackerChanged={this.handleTrackerChanged}
                enablePanZoom={true}
            >
                {rows}
            </ChartContainer>
        );
        
    };

    renderBrush = () => {

        const { totalseries, totalrange, 
            timerange, maxHeight, tracker, mintime, maxtime } = this.state;

        return (
            <ChartContainer
                timeRange={totalrange}
                format={"%b-%y"}
                trackerPosition={tracker}
            > 
                <ChartRow height="100" debug={false}>
                    <Brush
                        timeRange={timerange}
                        allowSelectionClear={true}
                        onTimeRangeChanged={this.handleTimeRangeChange}
                    />
                    <YAxis
                        id="axis1"
                        label="Totals"
                        min={0}
                        max={maxHeight}
                        width={70}
                        type="linear"
                        format="d"
                    />
                    <Charts>
                        <BarChart
                            axis="axis1"
                            columns={channelNames.slice(0).reverse()} // matches alignment of top
                            style={style}
                            series={totalseries}
                            minBarHeight={0}
                        />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    };

    renderModeOptions = () => {
        const linkStyle = {
            fontWeight: 600,
            color: "grey",
            cursor: "default"
        };

        const linkStyleActive = {
            color: "blue",
            cursor: "pointer"
        };

        return (
            <div style={{ fontSize: 20, color: "#f7978a" }}>
                <span
                    style={this.state.windowSize !== "day" ? linkStyleActive : linkStyle}
                    onClick={() => this.setState(() => ({ windowSize: "day" }))}
                > 
                    day
                </span>
                <span> | </span>
                <span
                    style={this.state.windowSize !== "week" ? linkStyleActive : linkStyle}
                    onClick={() => this.setState(() => ({ windowSize: "week" }))}
                >
                    week
                </span>
                <span> | </span>
                <span
                    style={this.state.windowSize !== "month" ? linkStyleActive : linkStyle}
                    onClick={() => this.setState(() => ({ windowSize: "month" }))}
                >
                    month
                </span>
            </div>
        );

    };

    onLegendSelection = channelName => {
        let channels = this.state.channels;

        // if channelNames becomes too big 
        // this will become an expensive operation 
        // it would be better to set display channels in state 
        if (channelNames.filter(channelName => {
            if (channels[channelName].show) {
                return true;
            } else {
                return false;
            }
        }).length <= 1) {
            // do something: TBD 
        } 

        channels[channelName].show = !channels[channelName].show; 
        this.setState(() => ({channels}));
    }

    render() {

        const { ready, channels, windowSize, tracker, timerange } = this.state;

        if (!ready) {
            return (
                <div>
                    Loading
                </div>
                );
        }

        // Generate the legend
        const legend = channelNames.map(channelName => ({
            key: channelName,
            label: channels[channelName].label
        }));

        let trackertime = moment.utc(+tracker)

        let selectiondate = null; 
        if (windowSize === 'day') {
            selectiondate = trackertime.format('MM/DD/YY');
        } else if (windowSize === 'week') {
            let weekstart = null;
            let weekend = null
            if (trackertime.isSameOrAfter(trackertime.clone().day(4))) {
                weekstart = trackertime.clone().day(4); 
                weekend = trackertime.clone().day(10); 
            } else {
                weekstart = trackertime.clone().day(-3); 
                weekend = trackertime.clone().day(3); 
            }
            selectiondate = 
                `${weekstart.format('ddd MM/DD/YY')} - ${weekend.format('ddd MM/DD/YY')}`;
        } else if (windowSize === 'month') {
            selectiondate = trackertime.format('MMM-YY');
        }

        return (
            <div>
                <div>
                    {this.renderModeOptions()}
                </div>

                <Legend
                    type={"dot"}
                    style={style}
                    categories={legend}
                    onSelectionChange={this.onLegendSelection}
                />

                <div>
                    {tracker >= timerange.begin() && tracker <= timerange.end()
                        ? `${selectiondate}`
                        : null}
                </div>

                <Resizable>
                    {ready ? this.renderChart() : <div>Loading.....</div>}
                </Resizable>
                
                <Resizable>
                    {ready ? this.renderBrush() : <div />}
                </Resizable>
                
            </div>
        );

    };
}

export default ProgressPage;