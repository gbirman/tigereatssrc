
import React from 'react';
import _ from "underscore";
import Select from "react-select";
import axios from 'axios';

// Pond
import { TimeEvent, TimeSeries } from "pondjs";

import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    AreaChart,
    Legend,
    Resizable,
    styler
} from "react-timeseries-charts";

// capitalizes first letter of string 
let format = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export default class ProgressPage extends React.Component {

    state = {
        series: null,
        columnNames: [],
        highlight: null,
        selection: null,
        scheme: "Paired",
        cols: [],
        selectedOption: [],
        maxVals: {},
        maxVal: 0, 
        waitingForData: true
    };
      
    // when options are changed
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        // builds array of column names from selected options 

        console.log(selectedOption)

        const validColumns = []
        const validMax = [] 
        for (const [key, value] of Object.entries(selectedOption)) {
            const name = selectedOption[key]['label']
            validColumns.push(name)
            validMax.push(this.state.maxVals[name])
        }
        let maxVal = 0
        if (validMax.length == 0) maxVal = this.state.maxVal;
        else maxVal = validMax.reduce((a, b) => a + b, 0); // get the sum
        console.log(maxVal)

        let a = Object.entries(selectedOption)
        .map( ([key]) => selectedOption[key]['label'] );
        this.setState({cols: { up: a, down: [] }, maxVal: maxVal})
    }

    // Save student data for a page refresh?
    componentDidMount() {

        console.log('got here')
        let user_id = this.props.match.params.id;
        // console.log("Gabe's page UID = " + JSON.stringify(this.props.match)); // debugging
    
        axios.get(
            '/api/get_user_nutrient_progress_all',
            {
                params: {
                // user_id: "5bf8ca12e7179a56e21592c5"
                user_id: user_id 
            }},
            {
                headers: {'Content-type': 'application/json'}
            }
        ).then((data) => {
            let details = data['data'];
            
            console.log(details)

            // get column names via initial ordering of nutrients 
            let nutrient_dict = Object.entries(details)[0][1] // nutrient dictionary of first datapoint
            const columnNames = []; // nutrient types 
            const maxVals = {}; // max value of each nutrient type
            for (const [nutrient_name, _] of Object.entries(nutrient_dict)) {
                const name = format(nutrient_name);
                columnNames.push(name);
                maxVals[name] = 0
            }
            
            // convert data to useable form (array)
            const points = [];
            for (const [t, nutrients] of Object.entries(details)) {
                const point = [new Date(t)]; 
                for (const [nutrient_name, nutrient_amount] of Object.entries(nutrients)) {
                    const name = format(nutrient_name)
                    if (nutrient_amount > maxVals[name]) {
                        maxVals[name] = nutrient_amount;  
                    }                 
                    point.push(nutrient_amount);
                }
                points.push(point);
            }
            // console.log(points)
            // points.map(p => console.log(p));
            // console.log(Math.max(...points[0].slice(1, points[0].length)));

            // Process out data into a TimeSeries
            const name = "series";
            const columns = ["time", ...columnNames];
            const series = new TimeSeries({ name, columns, points });

            // get maximum value of the data points 
            const validMax = [] 
            for (const [_, value] of Object.entries(maxVals)) {
                validMax.push(value)
            }
            const maxVal = validMax.reduce((a, b) => a + b, 0); // get the sum
            console.log(maxVals)

            // set state and render using callback function 
            this.setState({series: series, columnNames: columnNames, 
                cols: { up: columnNames, down: [] }, 
                selectedOption: columnNames.map(c => ({ value: c, label: c })),
                maxVals: maxVals, maxVal: maxVal, waitingForData: false}, 
                this.render); 

        })

    }

    // componentDidUpdate(prevProps, prevState) {    
    // }

    render() {

        if (this.state.waitingForData) return null;

        const min = 0;
        const max = this.state.maxVal;
        const axisType = "linear";
        const interpolationType = "curveLinear";
        const allOptions = this.state.columnNames.map(c => ({ value: c, label: c }));
        const style = styler(this.state.columnNames, this.state.scheme);
        const legendCategories = this.state.columnNames.map(d => ({ key: d, label: d }));

        return (
            <div>
                <div className="row">
                    <div className="col-md-3">
                        <Select
                            name="form-field-name"
                            value={this.state.selectedOption}
                            isMulti={true}
                            options={allOptions}
                            clearable={true}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="col-md-9">
                        <Legend categories={legendCategories} style={style} type="dot" />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={this.state.series.range()}
                                onBackgroundClick={() => this.setState({ selection: null })}
                            >
                                <ChartRow height="350">
                                    <YAxis
                                        id="value"
                                        min={min}
                                        max={max}
                                        width="60"
                                        type={axisType}
                                    />
                                    <Charts>
                                        <AreaChart
                                            axis="value"
                                            style={style}
                                            series={this.state.series}
                                            columns={this.state.cols}
                                            fillOpacity={0.4}
                                            interpolation={interpolationType}
                                            highlight={this.state.highlight}
                                            onHighlightChange={highlight =>
                                                this.setState({ highlight })
                                            }
                                            selection={this.state.selection}
                                            onSelectionChange={selection =>
                                                this.setState({ selection })
                                            }
                                            stack={true}
                                        />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    
    }

}