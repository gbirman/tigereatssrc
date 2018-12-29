import React from 'react';
import FilterExpansionsModule from './FilterExpansionsModule';
import TableModule from './TableModule';
import axios from 'axios';
import {Router, Route, Link, NavLink } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import SimpleModal from './SimpleModal';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ChangeGoalsModuleQuantities from './ChangeGoalsModuleQuantities'
import ChangeGoalsModulePercentages from './ChangeGoalsModulePercentages'

export default class ChangeGoalsPage extends React.Component {

    // todo change order and add note about equation
    state = {
        calGoal: this.props.match.params.calorie_goal,
        proGoal: this.props.match.params.protein_goal,
        fatsGoal: this.props.match.params.fats_goal,
        carbsGoal: this.props.match.params.carbs_goal,
        id: this.props.match.params.id,
        verified: false,
        inputOption: "op1"
    };

    validate = () => {
        console.log(this.state.calGoal + " " + this.state.proGoal + " " + this.state.fatsGoal + " " + this.state.carbsGoal);
        
        let result;

        axios.post(
            '/api/change_nutrition_goals',
            {
                user_id: this.state.id, 
                new_calorie_goal: this.state.calGoal,
                new_protein_goal: this.state.proGoal,
                new_carbs_goal: this.state.carbsGoal,
                new_fats_goal: this.state.fatsGoal,
                input_option: this.state.inputOption
            },
            {
                headers: {'Content-type': 'application/json'}
            }
        ).then((data) => {
            console.log(data);
            result = data['data'];

            if (result) {
                this.setState({verified: result}, () => {
                    this.props.history.push("/verified/" + this.state.verified);
                    console.log("/verified/" + this.state.verified);
                })
            }
            else {
                alert('Valid values only!');
            }
        })        
    }

    handleProteinChange = (quantity) => {
        this.setState({proGoal: quantity});
    }

    handleFatsChange = (quantity) => {
        this.setState({fatsGoal: quantity});
    }

    handleCarbsChange = (quantity) => {
        this.setState({carbsGoal: quantity});
    }

    handleCalChange = (quantity) => {
        this.setState({calGoal: quantity});
    }

    handleFormChange = (e) => {
        this.setState({inputOption: e.target.value})
    }

    render() {
        return (
            <div>
                
                <Paper style={{marginRight: '10%', marginLeft: '10%'}}>
                    <Grid container justify="center">
                        <h1>Change your goals below!</h1>
                    </Grid>
                </Paper>
                <Paper style={{marginRight: '30%', marginLeft: '30%', marginTop: '2%', marginBottom: '2%'}}>
                    <Grid container justify="center">
                        <p align="center">Totals must follow the following equality: <br />Calories = 4 * Protein + 4 * Carbs + 9 * Fat</p>
                    </Grid>
                </Paper>
                <Paper style={{marginRight: '30%', marginLeft: '30%', marginTop: '2%', marginBottom: '2%', paddingTop: '1%'}}>
                    <Grid container justify="center">
                        <FormControl component="fieldset">
                            <Grid item style={{textAlign: "center"}}>
                                <FormLabel component="legend">Please select one of the following options for input:</FormLabel>
                            </Grid>
                            <RadioGroup
                                value={this.state.inputOption}
                                onChange={this.handleFormChange}
                            >
                                <FormControlLabel value="op1" control={<Radio />} label="Input daily protein, carbohydrate, and fat goals" />
                                <FormControlLabel value="op2" control={<Radio />} label="Input daily caloric goal and macronutrient breakdown" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Paper>
                <Paper style={{marginRight: '5%', marginLeft: '5%'}}>
                    {this.state.inputOption === "op1" && <ChangeGoalsModuleQuantities
                        proteinGoal={this.props.match.params.protein_goal}
                        carbsGoal={this.props.match.params.carbs_goal}
                        fatsGoal={this.props.match.params.fats_goal}
                        calGoal={this.props.match.params.calorie_goal}
                        onProChange={this.handleProteinChange}
                        onCarbsChange={this.handleCarbsChange}
                        onFatsChange={this.handleFatsChange}
                        onCalChange={this.handleCalChange}
                    />}
                    {this.state.inputOption === "op2" && <ChangeGoalsModulePercentages 
                        proteinGoal={this.props.match.params.protein_goal}
                        carbsGoal={this.props.match.params.carbs_goal}
                        fatsGoal={this.props.match.params.fats_goal}
                        calGoal={this.props.match.params.calorie_goal}
                        onProChange={this.handleProteinChange}
                        onCarbsChange={this.handleCarbsChange}
                        onFatsChange={this.handleFatsChange}
                        onCalChange={this.handleCalChange}
                    />}
                    <Grid container justify="center" style={{padding: 20}} alignItems="center">
                        <Button variant="contained" color="primary" onClick={() => this.validate()}>Submit Changes!</Button>
                    </Grid>
                </Paper>
            </div>
        );
    }
}
