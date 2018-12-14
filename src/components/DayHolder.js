import React from 'react';
import DayDetails from './DayDetails';
import MealBreakfast from './MealBreakfast';
import MealLunch from './MealLunch';
import MealDinner from './MealDinner';

// How are servings stored?
export default class DayHolder extends React.Component {

    // TODO: Only display meals if they exist/were logged
    render () {
    
        return (
            <div>
            <table border = "3" align="center">
                <tr>
                    <DayDetails 
                    date = {this.props.date} 
                    dayNutrients = {this.props.dayInfo[0]}
                    />
                </tr>

                <tr>
                    <td><MealBreakfast
                        mealName = "Breakfast"
                        mealData = {this.props.dayInfo[1]}

                    /></td>
                    <td><MealBreakfast 
                        mealName = "Lunch"
                        mealData = {this.props.dayInfo[2]}

                    /></td>
                    <td><MealBreakfast 
                        mealName = "Dinner"
                        mealData = {this.props.dayInfo[2]}
                    /></td>
                </tr>

            </table>
        </div>);
    }
}