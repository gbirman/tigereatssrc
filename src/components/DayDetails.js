import React from 'react';


export default class DayDetails extends React.Component {

    // TODO: Add goals info (ex. daily cals out of how many cals)
    render () {

        return (
            <div>
            <h3>
             Date: {this.props.date.substring(8)} / {this.props.date.substring(5,7)} / {this.props.date.substring(0,4)} 
             </h3>
            
             <h3> 
             Daily Nutrients: &#160;
            Cals =  {this.props.dayNutrients.calories} &#160;
            Protein = {this.props.dayNutrients.protein} &#160;
            Carbs =   {this.props.dayNutrients.carbs} &#160;
            Fat =  {this.props.dayNutrients.fat}             
             </h3>

            
            </div>

        );
    }
}