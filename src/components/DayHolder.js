import React from 'react';
import DayDetails from './DayDetails';
import Meal from './Meal';


// How are servings stored?
export default class DayHolder extends React.Component {

    // TODO: Only display meals if they exist/were logged
    // TODO: Figure out why this is being rendered four times? Should that be happening

    render () {
       //  console.log("\n meal data: \n  " + JSON.stringify(this.props.dayInfo[3])); // debugging
        let defaultMeal = [ // fixes rerendering issue where certain meals weren't defined yet, addresses non-logged meals
            {
                calories: 0,
                carbs: 0,
                fat: 0,
                protein: 0
            },
            {
                "MEAL NOT ": "LOGGED"
            }
    
        ]

        return (
            <div>
            <table border = "3" align="center">
                <tr>
                    <DayDetails 
                    date = {this.props.date} 
                    dayNutrients = {this.props.dayInfo[0] ? this.props.dayInfo[0] : defaultMeal}
                    />
                </tr>

                <tr>
                    <td><Meal
                        mealName = "Breakfast"
                        mealData = {this.props.dayInfo[1] ? this.props.dayInfo[1] : defaultMeal}

                    /></td>
                    <td><Meal
                        mealName = "Lunch"
                        mealData = {this.props.dayInfo[2] ? this.props.dayInfo[2] : defaultMeal}

                    /></td>
                    <td><Meal
                        mealName = "Dinner"
                        mealData = {this.props.dayInfo[3] ? this.props.dayInfo[3] : defaultMeal}
                    /></td>
                </tr>

            </table>
        </div>);
    }
}