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

export default class ChangeGoalsModuleQuantities extends React.Component {
    state = {
        calGoal: this.props.calGoal,
        proGoal: this.props.proteinGoal,
        fatsGoal: this.props.fatsGoal,
        carbsGoal: this.props.carbsGoal,
        proValue: false,
        carbsValue: false,
        fatsValue: false,
        calValue: false,
        calShouldBeCalculated: false,
        newCalVal: undefined
    }

    handleCalChange = (e) => {
        let val;

        if (e.target.value === "")
            val = false;
        else
            val = true;
        
        this.setState({newCalGoal: e.target.value, calValue: val});
    }

    handleProChange = (e) => {
        let val;

        if (e.target.value === "")
            val = false;
        else
            val = true;

        this.props.onProChange(e.target.value);
        
        this.setState({proValue: val, proGoal: e.target.value});
    }

    handleFatsChange = (e) => {
        let val;

        if (e.target.value === "")
            val = false;
        else
            val = true;
        
        this.props.onFatsChange(e.target.value);

        this.setState({fatsValue: val, fatsGoal: e.target.value});
    }

    handleCarbsChange = (e) => {
        let val;

        if (e.target.value === "")
            val = false;
        else
            val = true;

        this.props.onCarbsChange(e.target.value);
        
        this.setState({carbsValue: val, carbsGoal: e.target.value});
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
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Protein / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Carbs / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Fats / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Calories / Day</u></Grid>
                </Grid>
                <Grid container justify="center" alignItems="center">
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.props.proteinGoal}</Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.props.carbsGoal}</Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.props.fatsGoal}</Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}>{this.props.calGoal}</Grid>
                </Grid>
                <Grid container justify="center" alignItems="center">
                    <h2>New Goals:</h2>
                </Grid>
                <Grid container justify="space-around" alignItems="center"> 
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Protein / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Carbs / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Fats / Day</u></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><u>Calories / Day</u></Grid>
                </Grid>
                <Grid container justify="center" alignItems="center" style={{padding: 20}}>
                    <Grid item style={{textAlign: "center"}} xs={3}><Input placeholder={this.props.proteinGoal} onKeyUp={this.handleProChange} onBlur={this.handleFocusOut}/></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><Input placeholder={this.props.carbsGoal} onKeyUp={this.handleCarbsChange} onBlur={this.handleFocusOut}/></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><Input placeholder={this.props.fatsGoal} onKeyUp={this.handleFatsChange} onBlur={this.handleFocusOut}/></Grid>
                    <Grid item style={{textAlign: "center"}} xs={3}><Input placeholder={this.props.calGoal} onBlur={this.handleFocusOut} value={this.state.calShouldBeCalculated ? this.state.calGoal : ""}></Input></Grid>
                </Grid>
            </div>
        );
    }

}