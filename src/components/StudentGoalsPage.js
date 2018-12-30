import React from 'react';
import StudentDetails from './StudentDetails';
import DaysHolder from './DaysHolder';
import axios from 'axios';

export default class StudentGoalsPage extends React.Component {

    state = {
        dayInfo1: 'joe',   // []  if i had it as [], or {}, it wouldn't work!!!!
        dayNutrients: 'jim', // get rid of this
        breakfastInfo: 'bill', // get rid of this
        userInfo: "bilal",
        // dayInfoArray: [] // Testing for multiple days
        dayInfo2: 'joe',
        dayInfo3: 'joe',
        dayInfo4: 'joe'
    };

    // Save student data for a page refresh?
    componentDidMount() {
        this.getDayInfo(this.props.match.params.id, "2018-07-10", 1); // get date there
        this.getDayInfo(this.props.match.params.id, "2018-07-11", 2);
        this.getDayInfo(this.props.match.params.id, "2018-07-12", 3);
        this.getDayInfo(this.props.match.params.id, "2018-07-13", 4);
        this.getUserInfo(this.props.match.params.id); 

    }
    componentDidUpdate(prevProps, prevState) {    
    }

    getUserInfo = (user_id) => {
        axios.get(
            '/api/get_all_user_info',
            {

                params: {
                user_id: user_id
                }
            },
            {
                headers: { 'Content-type': 'application/json' }
            }
        ).then((data) => {
            let details = data['data'];

            console.log("User's email " + details[0] + "<- is here");
            
            this.setState((prevState) => {
              return {  
                dayInfo1: prevState.dayInfo1,
                userInfo: details,
               dayInfoArray: prevState.dayInfoArray // Testing for multiple days
              }
            });    
        })}


    


    // Gets a day's info given a user and a date
    getDayInfo = (user_id, date, day) => {
          axios.get(
                '/api/get_user_day_meal_data',
                {

                    params: {
                    user_id: user_id,
                    date: date
                    }
                },
                {
                    headers: { 'Content-type': 'application/json' }
                }
            ).then((data) => {
                let details = data['data'];

                console.log("The real deets " + details[0].calories + "<- are there");
                
                let dayInfoUpdated = [];
 

                if (day == 1) {
                this.setState((prevState) => {
                        return {  

                        dayInfo1: data['data'], 
                        dayInfo2: prevState.dayInfo2,
                        dayInfo3: prevState.dayInfo3,
                        dayNutrients: details[0],
                        breakfastInfo: details[1]
                        //dayInfoArray: prevState.dayInfoArray.push(data['data']) // Testing for multiple days
                        }
                });    
                }

                if (day == 2) {
                    this.setState((prevState) => {
                            return {  
                            dayInfo1: prevState.dayInfo1,
                            dayInfo2: data['data'], 
                            dayInfo3: prevState.dayInfo3,
                            dayNutrients: details[0],
                            breakfastInfo: details[1]
                            //dayInfoArray: prevState.dayInfoArray.push(data['data']) // Testing for multiple days
                            }
                    });    
                    }

                    if (day == 3) {
                        this.setState((prevState) => {
                                return {  
                                dayInfo1: prevState.dayInfo1,
                                dayInfo2: prevState.dayInfo2,
                                dayInfo3: data['data'], 
                                dayInfo4: prevState.dayInfo4,
                                dayNutrients: details[0],
                                breakfastInfo: details[1]
                                //dayInfoArray: prevState.dayInfoArray.push(data['data']) // Testing for multiple days
                                }
                        });    
                        }

                        if (day == 4) {
                            this.setState((prevState) => {
                                    return {  
                                    dayInfo1: prevState.dayInfo1,
                                    dayInfo2: prevState.dayInfo2,
                                    dayInfo3: prevState.dayInfo3,
                                    dayInfo4: data['data'],
                                    dayNutrients: details[0],
                                    breakfastInfo: details[1]
                                    //dayInfoArray: prevState.dayInfoArray.push(data['data']) // Testing for multiple days
                                    }
                            });    
                            }



            })}
    
    
            // TODO: I'll need to create the list of days here, I currently only get one (today)
            // this day and not just getDay()
           // let daysPreprocessed = this.getDay(this.props.userID, this.props.date); // MOVE
           // console.log(daysPreprocessed); // DEBUGGING


    getToday() { // can be changed to get yesterdays date, etc (I'm sure there's a method we can use)
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; //January is 0!
        let yyyy = today.getFullYear();
        if(dd<10) {
            dd = '0'+dd
        } 
        if(mm<10) {
            mm = '0'+mm
        } 
        today = yyyy + "-" + mm + "-" + dd;
        console.log("Today is: " + today); // Debugging
        return today;
    }

    render() {
        
        console.log("Paulo's UID = " + JSON.stringify(this.props.match.params.id));
        let user_id = this.props.match.params.id; // Paulo: Yeah so I need this from the previous page. It's currently Ishan

        // Old bug: it couldn't find getToday
        //let date = this.getToday(); // Fix and get this from some call to the current date
        let date = "2018-07-10";

        // console.log("dayNutrients.calories: " + this.state.dayNutrients.calories + "<- are there");
        // console.log("dayInfo[0]  " + this.state.dayInfo[0].calories + "<- are there");
        //console.log("Day info is: " + dayInfo + " That is all "); // debugging 
        // Things I might not need: "width:100%"

        let userInfoTest = ["jamie@tigermag.com", "Jamies", "Mercurio",
                            "Male", "5 9", "150lbs", "no restrictions mofo", 
                        "1000CAL", "2000PRO", "0FAT", "350POUNDSMUSCLE", "2020", "Little League MMA"];
       
        let fullName = this.state.userInfo[1] + " " + this.state.userInfo[2];


        // TODO: dayInfoArray = {this.state.dayInfoArray}

        return (
           <div>

           <table border = "3" align = "center">
            <tbody>
                <tr>
                    <StudentDetails
                    user_id = {user_id}
                    userInfo = {this.state.userInfo}
                    fullName = {fullName}
                    />
                </tr>

                <tr>
                <h2>Logged Meals</h2>
                </tr>

                <tr>
                <DaysHolder 
                user_id = {user_id}
                date = {date}
                dayInfo1 = {this.state.dayInfo1}
                dayInfo2 = {this.state.dayInfo2}
                dayInfo3 = {this.state.dayInfo3}
                dayInfo4 = {this.state.dayInfo4}
                
                />
                </tr>
            </tbody>
           </table>

                      
           </div>
        );
    }

}
