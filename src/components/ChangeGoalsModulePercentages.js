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

export default class ChangeGoalsModulePercentages extends React.Component {
    state = {
        calGoal: this.props.calGoal,
        proGoal: this.props.proteinGoal,
        fatsGoal: this.props.fatsGoal,
        carbsGoal: this.props.carbsGoal,
        proPerc: undefined,
        carbsPerc: undefined,
        fatsPerc: undefined,
        calReady: false,
        proPercReady: false,
        carbsPercReady: false,
        fatsPercReady: false,
        calShouldBeCalculated: false
    }

    handleCalChange = (e) => {
        console.log(e.target.value);
        if (e.target.value === "")
            this.setState({calGoal: this.props.calGoal}, () => {this.updateOtherGoals(); this.props.onCalChange(this.state.calGoal);});
        else
            this.setState({calGoal: e.target.value},  () => {this.updateOtherGoals(); this.props.onCalChange(this.state.calGoal);});
    }

    updateOtherGoals = () => {
        this.updatePro();
        this.updateFats();
        this.updateCarbs();
    }

    updatePro = () => {
        const perc = this.state.proPerc;
        if (perc) {
            const cals = this.state.calGoal;
            const newPro = parseInt(cals) * (parseInt(perc) / 100) / 4;
            this.setState({proGoal: newPro}, () => this.props.onProChange(this.state.proGoal));
        }
        else
            this.setState({proGoal: undefined})
    }

    updateFats = () => {
        const perc = this.state.fatsPerc;
        if (perc) {
            const cals = this.state.calGoal;
            const newFats = parseInt(cals) * (parseInt(perc) / 100) / 9;
            this.setState({fatsGoal: newFats}, () => this.props.onFatsChange(this.state.fatsGoal));
        }
        else
            this.setState({fatsGoal: undefined})
    }

    updateCarbs = () => {
        const perc = this.state.carbsPerc;
        if (perc) {
            const cals = this.state.calGoal;
            const newCarbs = parseInt(cals) * (parseInt(perc) / 100) / 4;
            this.setState({carbsGoal: newCarbs}, () => this.props.onCarbsChange(this.state.carbsGoal));
        }
        else
            this.setState({carbsGoal: undefined})
    }

    handleProChange = (e) => {
        if (e.target.value === "")
            this.setState({proPerc: undefined}, () => this.updatePro());
        else
            this.setState({proPerc: e.target.value}, () => this.updatePro());
    }

    handleFatsChange = (e) => {
        if (e.target.value === "")
            this.setState({fatsPerc: undefined}, () => this.updateFats());
        else
            this.setState({fatsPerc: e.target.value}, () => this.updateFats());
    }

    handleCarbsChange = (e) => {
        if (e.target.value === "")
            this.setState({carbsPerc: undefined}, () => this.updateCarbs());
        else
            this.setState({carbsPerc: e.target.value}, () => this.updateCarbs());
    }

    handleFocusOut = (e) => {
        let carbs = this.state.carbsValue;
        let fats = this.state.fatsValue;
        let pros = this.state.proValue;

        if (carbs && pros && fats) {
            let newCal = 4 * parseInt(this.state.carbsGoal) + 9 * parseInt(this.state.fatsGoal) + 4 * parseInt(this.state.proGoal);
            this.setState({calShouldBeCalculated: true, calGoal: newCal}, () => this.props.onCalChange(newCal));
        }
        else
            this.setState({calShouldBeCalculated: false}, () => {console.log('n')})
    }

    render() {
        return (
            <div>
                <Grid container justify="center" alignItems="center">
                    <h2>Current Goals:</h2>
                </Grid>
                <Grid container justify="center" alignItems="center">
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Calories / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Protein / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Carbs / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Fats / Day</u></Grid>
                </Grid>
                <Grid container justify="center" alignItems="center">
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.props.calGoal}</Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.props.proteinGoal}</Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.props.carbsGoal}</Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.props.fatsGoal}</Grid>
                </Grid>
                <Grid container justify="center" alignItems="center">
                    <h2>New Caloric Goal and Percentage Breakdown:</h2>
                </Grid>
                <Grid container justify="space-around" alignItems="center"> 
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Calories / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>% Protein</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>% Carbs</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>% Fats</u></Grid>
                </Grid>
                <Grid container justify="center" alignItems="center" style={{padding: 20}}>
                    <Grid item style={{textAlign: "center"}} xs={3}><Input placeholder={this.props.calGoal} onKeyUp={this.handleCalChange} /></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><Input placeholder={'carbs'} onKeyUp={this.handleProChange} /></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><Input placeholder={'fats'} onKeyUp={this.handleCarbsChange} /></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><Input placeholder={'calories'} onKeyUp={this.handleFatsChange}></Input></Grid>
                </Grid>
                <Grid container justify="center" alignItems="center">
                    <h2>New Goals:</h2>
                </Grid>
                <Grid container justify="space-around" alignItems="center"> 
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Calories / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Protein / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Carbs / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Fats / Day</u></Grid>
                </Grid>
                <Grid container justify="center" alignItems="center" >
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.state.calGoal}</Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.state.proGoal}</Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.state.carbsGoal}</Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.state.fatsGoal}</Grid>
                </Grid>
            </div>
        );
    }

}