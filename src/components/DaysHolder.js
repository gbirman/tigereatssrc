import React from 'react';
import DayHolder from './DayHolder';


export default class DaysHolder extends React.Component {

    //let breakfastFood = ['Eggs', 'Hashbrowns'];

    render () {

        // Mock Data
        let days =  [

            {
            date: "10102018",
            cals: "400",
            protein: "40",
            carbs: "300",
            fat: "52",
            breakfastFood: ["cereal"], 
            lunchFood: ["ham sandwich"],
            dinnerFood: ["meatloaf"]
            },
            {
            date: "10112018",
            cals: "400",
            protein: "26",
            carbs: "430",
            fat: "34",
            breakfastFood: ["scrambled eggs"], 
            lunchFood: ["chicken caesar wrap"],
            dinnerFood: ["chicken wings"]
            }
        
            ];



        // TODO: Pass in Date
        /* 
         <DayHolder 
            breakfastFood = {['Eggs', 'Hash Browns']}
            lunchFood = {['Turkey Sandwich']}
            dinnerFood = {['Spaghetti and Meatballs']}
            />
            <DayHolder
            breakfastFood = {['Eggs Benedict']}
            lunchFood = {['Cheese Quesadilla']}
            dinnerFood = {['Teriyaki Chicken']}
            />

        */

            /* Confirming dinner isn't just missing for one of the days




            */

        // TODO: Use automated dates, looking at the last four days
        return (
            <div>
            <DayHolder key={this.props.date} 
                date = {this.props.date}
                dayInfo={this.props.dayInfo1}
            /> 
            
            <DayHolder key="2018-07-11" 
                date = "2018-07-11"
                dayInfo={this.props.dayInfo2}
            />
            <DayHolder key="2018-07-12"
                date = "2018-07-12"
                dayInfo={this.props.dayInfo3}
            />
            <DayHolder key="2018-07-13"
                date = "2018-07-13"
                dayInfo={this.props.dayInfo4}
            />

            </div>

        );
    }
}