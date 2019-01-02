import React from 'react';
import {ChartRow, LabelAxis, Charts, Baseline,
        ValueAxis, ChartContainer, Resizable,
        BarChart, styler} from 'react-timeseries-charts';
import { filter} from 'pondjs';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import {themecolors} from '../styles/color';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    paper: {
        //...theme.mixins.gutters(),
        //paddingTop: theme.spacing.unit * 2,
        //paddingBottom: theme.spacing.unit * 2,
        backgroundColor: `${themecolors.lightgray}`,
        height: "100%",
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    }
});

const ChannelsChart = (props) => {

    const minwidth = useMediaQuery(`(min-width:${props.theme.breakpoints.values.sm}px)`);

    const {classes} =  props;
    const { ready, channels, tracker, trackerIdx, timerange, 
            rollupSize, channelNames, style, values } = props;

    const [width, setWidth] = React.useState({width: window.innerWidth});

    const rows = [];

    // determine which channels to display 
    const displayChannels = channelNames.filter(channelName => {
        if (channels[channelName].show) {
            return true;
        } else {
            return false;
        }
    })
    
    // let values = {};
    displayChannels.map(channelName => {

        let series = null; 
        if (rollupSize === 'day') {
            series = channels[channelName].dailyseries;
        } else if (rollupSize === 'week') {
            series = channels[channelName].weeklyseries;
        } else if (rollupSize === 'month') {
            series = channels[channelName].monthlyseries;
        }

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

        // // Get the value at the current tracker position for the ValueAxis
        // let value = "--";
        // if (trackerIdx !== null) {

        //     let nullseries = null;
        //     if (rollupSize === 'day') {
        //         nullseries = channels[channelName].dailyseries_null;
        //     } else if (rollupSize === 'week') {
        //         nullseries = channels[channelName].weeklyseries_null;
        //     } else if (rollupSize === 'month') {
        //         nullseries = channels[channelName].monthlyseries_null;
        //     }

        //     if (nullseries.at(trackerIdx).get(channelName)) {
        //         value = parseInt(series.at(trackerIdx).get(channelName), 10);
        //     }
        // }
        // values[`${channelName}`] = value; 

        // Get the summary values for the LabelAxis
        let subseries = channels[channelName].subseries;
        const summary = [
            { label: "Min", value: parseInt(subseries.min(channelName, filter.ignoreMissing), 10) || '--' },
            { label: "Max", value: parseInt(subseries.max(channelName, filter.ignoreMissing), 10) || '--' },
            { label: "Avg", value: parseInt(subseries.avg(channelName, filter.ignoreMissing), 10) || '--' }
        ];

        const containerHeight = 350;

        rows.push(
            <ChartRow
                height={containerHeight / displayChannels.length}
                key={`row-${channelName}`}
            >
                <LabelAxis
                    visible={minwidth}
                    id={`${channelName}_axis`}
                    label={channels[channelName].label}
                    values={summary}
                    min={0}
                    max={channels[channelName].max}
                    width={100}
                    type="linear"
                    format="d"
                />
                <Charts>
                    {charts}
                    <Baseline
                        key={`line-${channelName}`}
                        axis={`${channelName}_axis`}
                        value={channels[channelName].goal}
                        //label={`Goal: ${parseInt(channels[channelName].goal)}`}
                        style = {{ line: { stroke: "#595959", strokeWidth: 0.5, strokeDasharray: "4,4", pointerEvents: "none" } }}
                    />
                </Charts>
                <ValueAxis
                    visible={minwidth}
                    id={`${channelName}_valueaxis`}
                    value={values[`${channelName}`]}
                    detail={channels[channelName].units}
                    width={70}
                    min={0}
                    max={35} // ??
                />
            </ChartRow>
        );

    });

    return (
        <Paper className={classes.paper}>
        <Resizable>
            {ready 
                ? 
                <ChartContainer
                    timeRange={timerange}
                    utc={true}
                    timeAxisTickCount={2}
                    trackerPosition={tracker}
                    onTimeRangeChanged={props.handleTimeRangeChange}
                    onTrackerChanged={props.handleTrackerChanged}
                    enablePanZoom={true}
                    paddingLeft={10}
                    paddingRight={10}
                    hideTimeAxis={minwidth ? false : true}
                >
                    {rows}
                </ChartContainer> 
                :
                <div>Loading.....</div>
            }
        </Resizable>
        </Paper>
    );
    
};

export default withStyles(styles, { withTheme: true })(ChannelsChart);