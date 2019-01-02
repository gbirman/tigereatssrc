import React from 'react';
import {ChartRow, Charts, YAxis, Brush,
    ChartContainer, Resizable,
    BarChart, styler} from 'react-timeseries-charts';
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
    }
});

const BrushChart = (props) => {

    const {classes} =  props;
    const { ready, totalseries, totalrange, 
        timerange, maxHeight, tracker, channelNames, style } = props;

    return (
        <Paper className={classes.paper}>
        <Resizable>
            { ready 
                ? 
                <ChartContainer
                    timeRange={totalrange}
                    format={"%b-%y"}
                    trackerPosition={tracker}
                    paddingLeft={15}
                    paddingRight={15}
                > 
                    <ChartRow height="100" debug={false}>
                        <Brush
                            timeRange={timerange}
                            allowSelectionClear={true}
                            onTimeRangeChanged={props.handleTimeRangeChange}
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