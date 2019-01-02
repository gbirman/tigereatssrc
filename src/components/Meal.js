import React from 'react';
import Button from '@material-ui/core/Button';

export default class MealBreakfast extends React.Component {

    // Displays the food and the serving amount for a given meal
    displayFood = (foodData) => {
        let output = '';
        for (let foodType in foodData) {
            output +=    foodType + " | " + foodData[foodType] + "   .   ";
        }
       // console.log(output);
        return output;

    }



    // TODO: New row for every part of food array
    render () {

        return (
            <div>
            <p> {this.props.mealName} </p>
            <table>
                <tr>
                    <p>Cals: {this.props.mealData[0].calories} | 
                    Protein: {this.props.mealData[0].protein}g | 
                    Carbs: {this.props.mealData[0].carbs}g | 
                    Fat: {this.props.mealData[0].fat}g </p>
                </tr>

                <tr>
                <p>{this.displayFood(this.props.mealData[1])}</p>
                </tr>

            </table>
            <Button variant="contained" color="primary">Add Note</Button>
            
            </div>

        );
    }
}
