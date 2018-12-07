import React from 'react';
import FilterExpansionsModule from './FilterExpansionsModule';
import TableModule from './TableModule';
import axios from 'axios';
import {Router, Route, Link, NavLink } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import SimpleModal from './SimpleModal';

export default class ChangeGoalsPage extends React.Component {

    state = {
        calGoal: this.props.match.params.calorie_goal,
        proGoal: this.props.match.params.protein_goal,
        fatsGoal: this.props.match.params.fats_goal,
        carbsGoal: this.props.match.params.carbs_goal,
        verified: false,
        showError: false
    };

    handleErrorToggle = () => {
        this.setState({showError: !this.state.showError});
    }

    validate = () => {
        console.log(this.state.calGoal + " " + this.state.proGoal + " " + this.state.fatsGoal + " " + this.state.carbsGoal);
        const val = (this.state.calGoal >= 0 && this.state.proGoal >= 0 && this.state.fatsGoal >= 0 && this.state.carbsGoal >= 0);
        
        if (val) {
            this.setState({verified: val}, () => {
                this.props.history.push("/verified/" + this.state.verified);
                console.log("/verified/" + this.state.verified);
            })
        }
        else {
            this.handleErrorToggle();
        }
    }

    handleCalChange = (e) => {
        this.setState({calGoal: e.target.value});
        console.log(e.target.value);
    }

    handleProChange = (e) => {
        this.setState({proGoal: e.target.value});
    }

    handleFatsChange = (e) => {
        this.setState({fatsGoal: e.target.value});
    }

    handleCarbsChange = (e) => {
        this.setState({carbsGoal: e.target.value});
    }

    render() {
        return (
            <div>
                <Paper padding={30} >
                    <Grid container justify="center">
                        <h1>Change your goals below!</h1>
                    </Grid>
                    <Grid container justify="center" alignItems="center">
                        <h2>Current Goals:</h2>
                    </Grid>
                    <Grid container justify="space-around" alignItems="center">
                        <Grid item xs={3}><u>Calories / Day</u></Grid>
                        <Grid item xs={3}><u>Protein / Day</u></Grid>
                        <Grid item xs={3}><u>Fats / Day</u></Grid>
                        <Grid item xs={3}><u>Carbs / Day</u></Grid>
                    </Grid>
                    <Grid container justify="center" alignItems="center">
                        <Grid item xs={3}>{this.props.match.params.calorie_goal}</Grid>
                        <Grid item xs={3}>{this.props.match.params.protein_goal}</Grid>
                        <Grid item xs={3}>{this.props.match.params.fats_goal}</Grid>
                        <Grid item xs={3}>{this.props.match.params.carbs_goal}</Grid>
                    </Grid>
                    <Grid container justify="center" alignItems="center">
                        <h2>New Goals:</h2>
                    </Grid>
                    <Grid container justify="space-around" alignItems="center">
                        <Grid item xs={3}><u>Calories / Day</u></Grid>
                        <Grid item xs={3}><u>Protein / Day</u></Grid>
                        <Grid item xs={3}><u>Fats / Day</u></Grid>
                        <Grid item xs={3}><u>Carbs / Day</u></Grid>
                    </Grid>
                    <Grid container justify="center" alignItems="center" style={{padding: 20}}>
                        <Grid item xs={3}><Input placeholder={this.props.match.params.calorie_goal} onKeyUp={this.handleCalChange}/></Grid>
                        <Grid item xs={3}><Input placeholder={this.props.match.params.protein_goal} onKeyUp={this.handleProChange}/></Grid>
                        <Grid item xs={3}><Input placeholder={this.props.match.params.fats_goal} onKeyUp={this.handleFatsChange}/></Grid>
                        <Grid item xs={3}><Input placeholder={this.props.match.params.carbs_goal} onKeyUp={this.handleCarbsChange}/></Grid>
                    </Grid>
                </Paper>
                <Grid container justify="center" style={{padding: 20}} alignItems="center">
                    <Button variant="contained" color="primary" onClick={() => this.validate()}>Submit Changes!</Button>
                </Grid>
                {this.state.showError &&
                    <SimpleModal onCloseRequest={() => this.handleErrorToggle}>
                        Error: Values are not valid!
                    </SimpleModal>
                }
            </div>
        );
    }
}
