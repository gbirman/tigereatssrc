import React from 'react';
import FilterExpansionsModule from './FilterExpansionsModule';
import TableModule from './TableModule';
import axios from 'axios';
import {Router, Route, Link } from "react-router-dom";


export default class ChangeGoalsPage extends React.Component {


    render() {
        return (
            <div>
                <div>{this.props.match.params.id}</div>
                <div>{this.props.match.params.fullname}</div>
                <div>{this.props.match.params.calorie_goal}</div>
            </div>
        );
    }
}
