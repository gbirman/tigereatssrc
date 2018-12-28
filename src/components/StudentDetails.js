import React from 'react';
import PersonTile from './PersonTile';
import Profile from './Profile';
import Traits from './Traits';
import Goals from './Goals';


export default class StudentDetails extends React.Component {

    //   <PersonTile />
    render () {

        // May not need td - they say I need div
        // TODO: Get actual Props from somewhere, including the image for PersonTile
        return (
            <div>
            <table border = "3" cellSpacing = "60">
                <td><PersonTile /> </td>
                <td><Profile 
                    name={this.props.fullName}
                    class={this.props.userInfo[12]} 
                    team={this.props.userInfo[13]} 
                /> </td>
                <td><Traits
                    height={this.props.userInfo[4]}
                    age="21"
                    weight= {this.props.userInfo[5]} 
                    goalWeight = {this.props.userInfo[10]} 
                /> </td>
                <td><Goals 
                    user_id = {this.props.user_id}
                    calIntake="1400" calGoal={this.props.userInfo[7]} 
                    proteinIntake="45" proteinGoal={this.props.userInfo[8]} 
                    carbIntake="100" carbGoal={this.props.userInfo[9]} 
                    fatIntake="30" fatGoal={this.props.userInfo[10]} 
                /> </td>
            </table>
            </div>
        );
    }
}