import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import {ChartRow, LabelAxis, Charts, Baseline,
    ValueAxis, ChartContainer, Resizable,
    Brush, YAxis, BarChart, styler} from 'react-timeseries-charts';
import { TimeSeries, avg, sum, Index, filter, TimeRange} from 'pondjs';
import "moment-duration-format";
import moment from "moment";
import Grid from '@material-ui/core/Grid';
import RadioButtons from "./RadioButtons";
import CheckBoxes from "./CheckBoxes";
import ChannelsChart from "./ChannelsChart";
import BrushChart from "./BrushChart";
import {nutrientcolors} from '../styles/color';
import TrackerTime from './TrackerTime';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import NutritionValues from './NutritionValues';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import {themecolors} from '../styles/color';

const style = styler([
    { key: "calories", color: nutrientcolors.calories},
    { key: "carbs", color: nutrientcolors.carbs },
    { key: "fat", color: nutrientcolors.fat },
    { key: "protein", color: nutrientcolors.protein }
]);

// these are the names of the nutrients as specified in MongoDB 
// with associated metadata 
const channels = {
    calories: { units: "kcal", label: "Calories", show: true, goal: null,
        dailyseries_null: null, dailyseries: null, weeklyseries_null: null, weeklyseries: null, 
        monthlyseries_null: null, monthlyseries: null, subseries: null, amount: null },
    carbs: { units: "g", label: "Carbs", show: true, goal: null,
        dailyseries_null: null, dailyseries: null, weeklyseries_null: null, weeklyseries: null, 
        monthlyseries_null: null, monthlyseries: null, subseries: null, amount: null },
    fat: { units: "g", label: "Fat", show: true, goal: null,
        dailyseries_null: null, dailyseries: null, weeklyseries_null: null, weeklyseries: null, 
        monthlyseries_null: null, monthlyseries: null, subseries: null, amount: null },
    protein: { units: "g", label: "Protein", show: true, goal: null,
        dailyseries_null: null, dailyseries: null, weeklyseries_null: null, weeklyseries: null, 
        monthlyseries_null: null, monthlyseries: null, subseries: null, amount: null }
}

// these are the names of the nutrients as specified in MongoDB 
const channelNames = ['protein', 'fat', 'carbs', 'calories'];

// // Rollups we'll generate to reduce data for the screen
// const rollupLevels = ["1d", "3d", "5d", "7d"];

class ProgressPage extends React.Component {


    // functions to set window size in state 
    setWindowDay = () => this.setState(() => ({ rollupSize: "day" }));
    setWindowWeek = () => this.setState(() => ({ rollupSize: "week" }));
    setWindowMonth = () => this.setState(() => ({ rollupSize: "month" }));

    state = {
        ready: false,
        channels: channels,
        tracker: null,
        timerange: null,
        totalrange: null,
        totalseries: null,
        trackerIdx: null,
        maxHeight: null,
        rollupSize: 'day',
        mintime: null,
        maxtime: null,
        values: {calories: "--", carbs: "--", fat: "--", protein: "--"}
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
                
                // add goal data according to API-specified order 
                channels['calories'].goal = data[0];
                channels['protein'].goal = data[1];
                channels['fat'].goal = data[2];
                channels['carbs'].goal = data[3];
                this.setState(() => ({ channels }));
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
                        points[channelName].push([index, response_nutrients[channelName]])
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

                    // rollups 
                    let dailyseries_null = initialseries.dailyRollup({
                        //rollupSize: "1d",
                        aggregation: {[channelName]: {[channelName]: avg(filter.ignoreMissing)}}
                    });

                    let weeklyseries_null = dailyseries_null.fixedWindowRollup({
                        windowSize: "7d",
                        aggregation: {[channelName]: {[channelName]: avg(filter.ignoreMissing)}}
                    });

                    let monthlyseries_null = dailyseries_null.monthlyRollup({
                        aggregation: {[channelName]: {[channelName]: avg(filter.ignoreMissing)}}
                    });
                    
                    // converts series back to UTC format as rollups revert that 

                    // daily series null will be used for omitting zeroes 
                    // from calculations -- everywhere else zeroes will 
                    // be used for performance 
                    dailyseries_null = TimeSeries.timeSeriesListMerge({
                        seriesList: [dailyseries_null]
                    });

                    weeklyseries_null = TimeSeries.timeSeriesListMerge({
                        seriesList: [weeklyseries_null]
                    });

                    monthlyseries_null = TimeSeries.timeSeriesListMerge({
                        seriesList: [monthlyseries_null]
                    });

                    // fills nulls with zeroes
                    const dailyseries = dailyseries_null.fill({fieldSpec: channelNames})
                    const weeklyseries = weeklyseries_null.fill({fieldSpec: channelNames})
                    const monthlyseries = monthlyseries_null.fill({fieldSpec: channelNames})

                    // Raw series
                    channels[channelName].dailyseries_null = dailyseries_null;
                    channels[channelName].dailyseries = dailyseries;
                    channels[channelName].weeklyseries_null = weeklyseries_null;
                    channels[channelName].weeklyseries = weeklyseries;
                    channels[channelName].monthlyseries_null = monthlyseries_null;
                    channels[channelName].monthlyseries = monthlyseries;
                    channels[channelName].subseries = dailyseries_null;

                    // max simple statistics for each channel
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
        const { channels, rollupSize, timerange, values } = this.state

        let trackerIdx = null;

        let series = null; 
        let channelName = channelNames[0];
        if (rollupSize === 'day') {
            series = channels[channelName].dailyseries;
        } else if (rollupSize === 'week') {
            series = channels[channelName].weeklyseries;
        } else if (rollupSize === 'month') {
            series = channels[channelName].monthlyseries;
        }

        if (t >= timerange.begin() && t <= timerange.end()) {
            trackerIdx = series.bisect(new Date(t));
        } else {
            this.setState(() => ({ tracker: null, trackerIdx: null, values: {
                calories: "--", carbs: "--", fat: "--", protein: "--" } }));
            return; 
        }

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
            let nullseries = null;
            if (rollupSize === 'day') {
                series = channels[channelName].dailyseries;
                nullseries = channels[channelName].dailyseries_null;
            } else if (rollupSize === 'week') {
                series = channels[channelName].weeklyseries;
                nullseries = channels[channelName].weeklyseries_null;
            } else if (rollupSize === 'month') {
                series = channels[channelName].monthlyseries;
                nullseries = channels[channelName].monthlyseries_null;
            }

            if (nullseries.at(trackerIdx).get(channelName)) {
                values[`${channelName}`] = 
                    parseInt(series.at(trackerIdx).get(channelName), 10);
            } else {
                values[`${channelName}`] = "--"; 
            }

        });

        this.setState(() => ({ tracker: t, trackerIdx, values }));

    };

    // Handles when the brush changes the timerange
    handleTimeRangeChange = (timerange) => {
        const { channels, rollupSize, tracker, mintime, maxtime } = this.state;

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
                    channels[channelName].dailyseries_null.slice(beginPos, endPos);
            });

            this.setState({ channels, timerange: new TimeRange(daystart, dayend)});
                
        } else {
            this.setState({ timerange: this.state.totalrange });
        }
    };

    toggleChannelShow = channelName => {
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
            // do something if all unchecked: TBD 
        } 

        channels[channelName].show = !channels[channelName].show; 
        this.setState(() => ({channels}));
    }

    render() {
    
        console.log(this.props.width);

        const { ready, channels, rollupSize, tracker, timerange } = this.state;

        if (!ready) {
            return (
                <div>
                    Loading
                </div>
                );
        }

        return (
            <div>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="stretch"
                    style={{height: "100%"}}
                >
                    <Grid item xs={12}> 
                        {isWidthUp('md', this.props.width) 
                        ?
                        <Grid 
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="stretch"
                            style={{height: 50}}
                        >
                            <Grid item xs={3}>
                                <RadioButtons 
                                    setWindowDay={this.setWindowDay}
                                    setWindowWeek={this.setWindowWeek}
                                    setWindowMonth={this.setWindowMonth}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <CheckBoxes 
                                    toggleChannelShow={this.toggleChannelShow}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TrackerTime {...this.state}>Hi</TrackerTime>
                            </Grid>
                        </Grid> 
                        :
                        <Grid 
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="stretch"
                            style={{backgroundColor: `${themecolors.darkgray}`, height: "120px"}}
                        >
                            <Grid item xs={isWidthUp('sm', this.props.width) ? 12 : 9}>
                                <Grid 
                                    container
                                    direction="column"
                                    justify="space-evenly"
                                    alignItems="stretch"
                                >
                                    {isWidthUp('sm', this.props.width)
                                    ?
                                    <React.Fragment>
                                    <Grid item xs={12}>
                                        <Grid 
                                            container
                                            direction="row"
                                            justify="space-evenly"
                                            alignItems="stretch"
                                            style={{height: "80px"}}
                                        >
                                            <Grid item xs={7}>
                                                <RadioButtons 
                                                    setWindowDay={this.setWindowDay}
                                                    setWindowWeek={this.setWindowWeek}
                                                    setWindowMonth={this.setWindowMonth}
                                                    smallScreen={true}
                                                /> 
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TrackerTime 
                                                    {...this.state} 
                                                    smallScreen={true}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CheckBoxes 
                                            toggleChannelShow={this.toggleChannelShow}
                                            smallScreen={true}
                                        />
                                    </Grid>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                    <Grid item xs={12}>
                                        <RadioButtons 
                                            setWindowDay={this.setWindowDay}
                                            setWindowWeek={this.setWindowWeek}
                                            setWindowMonth={this.setWindowMonth}
                                            smallScreen={true}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CheckBoxes 
                                            toggleChannelShow={this.toggleChannelShow}
                                            smallScreen={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TrackerTime 
                                            {...this.state} 
                                            smallScreen={true}
                                        />
                                    </Grid>
                                    </React.Fragment>
                                    }
                                </Grid>
                            </Grid>
                            {isWidthUp('sm', this.props.width)
                            ?
                            <div/>
                            :
                            <Grid item xs={3}>
                                <Grid 
                                    container
                                    direction="column"
                                    justify="space-evenly"
                                    alignItems="stretch"
                                >
                                    <Grid item xs={12}>
                                        <NutritionValues {...this.state} nutrient="Protein"/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <NutritionValues {...this.state} nutrient="Fat"/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <NutritionValues {...this.state} nutrient="Carbs"/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <NutritionValues {...this.state} nutrient="Calories"/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            }
                        </Grid>
                        }   
                    </Grid> 
                    <Grid item xs={12}>
                        <ChannelsChart 
                            {...this.state}
                            handleTimeRangeChange={this.handleTimeRangeChange}
                            handleTrackerChanged={this.handleTrackerChanged}
                            channelNames={channelNames}
                            style={style}
                        />
                    </Grid> 
                    {isWidthUp('md', this.props.width) 
                    ?
                    <Grid item xs={12}>
                        <BrushChart 
                            {...this.state}
                            handleTimeRangeChange={this.handleTimeRangeChange}
                            channelNames={channelNames}
                            style={style}
                        />
                     </Grid>
                     :
                     <div/>
                    }
            </Grid> 
            </div>
        );

    };
}

export default withWidth({withTheme: true})(ProgressPage);