import React from 'react';
import {ChartRow, Charts, YAxis, Brush,
    ChartContainer, Resizable,
    BarChart} from 'react-timeseries-charts';
import Paper from '@material-ui/core/Paper';
import {themecolors} from '../styles/color';
import { withStyles } from '@material-ui/core/styles';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

const styles = theme => ({
    paper: {
        backgroundColor: `${themecolors.darkgray}`,
        height: "100%",
        marginLeft: "1%",
        marginRight: "1%",
    }
});

// this stateless component represents the brush below
// the channesl chart 

const BrushChart = (props) => {

    const {classes} =  props;
    const { ready, totalseries, totalrange, 
        timerange, maxHeight, tracker, channelNames, style } = props;

    // hide axis when too small 
    const abovesm = useMediaQuery(`(min-width:${props.theme.breakpoints.values.sm}px)`);
    // for tick counts -- we want to prevent crowding
    const abovemd = useMediaQuery(`(min-width:${props.theme.breakpoints.values.md}px)`); 

    return (
        <Paper className={classes.paper}>
        <Resizable>
            { ready 
                ? 
                <ChartContainer
                    timeRange={totalrange}
                    format={"%b-%y"}
                    trackerPosition={tracker}
                    paddingTop={5}
                    paddingLeft={15}
                    paddingRight={15}
                    timeAxisStyle={{axis: {fill: "none", stroke: `${themecolors.darkgreen}`}, 
                                    ticks: {fill: "none", stroke: `${themecolors.darkgreen}`},
                                    values: {fill: `${themecolors.darkgreen}`, stroke: "none"}}}
                    hideTimeAxis={true}
                > 
                    <ChartRow 
                        height={abovemd ? "100" : "60"}
                        debug={false}>
                        <Brush
                            timeRange={timerange}
                            allowSelectionClear={true}
                            onTimeRangeChanged={props.handleTimeRangeChange}
                            style={{fill: "white", stroke: "none"}}
                        />
                        <YAxis
                            id="axis1"
                            //label="Totals"
                            min={0}
                            max={maxHeight}
                            width={50}
                            type="linear"
                            format="d"
                            visible={false}
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
                :
                <div />
            }
        </Resizable>
        </Paper>
    );
};

export default withStyles(styles, { withTheme: true })(BrushChart); 