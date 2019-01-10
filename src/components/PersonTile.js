import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Jamie from './images/Jamie.jpg';
import Gabe from './images/Gabe.jpg';
import Ishan from './images/Ishan.jpg';
import Paulo from './images/Paulo.jpg';
import PersonPlaceholder from './images/PersonPlaceholder.jpg';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

    buttonStyle: {
        fontFamily: 'Karla, sans-serif',
        color: 'white',
        border: 'solid',
        borderColor: '#d9f495'
    }
})

const textStyle = {
    color: "#59BF8E",
    fontFamily: 'Karla, sans-serif',
    lineHeight: 0.6
}

const imageStyle = {
    borderRadius: "20%",
}




export default withStyles(styles)(class PersonTile extends React.Component {

    state = { // does this happen right when desired
        
        watchlist_status: (this.props.initial_watchlist_status ? true: false)  // change in database to true to confirm if it works
    }
    
    componentDidMount() {
            // this.setState((prevState) => {
            //     return {
            //         watchlist_status: this.props.initial_watchlist_status // not really needed if it's still undefined
            //     }

            // }
            // );
        console.log("Initial Status: " + this.props.initial_watchlist_status); // debugging
    
    }

    addToWatchList() {
            
        //     this.setState((prevState) => { // done in the button
        //         return {  
        //             watchlist_status: !prevState.watchlist_status
        //         }
        // }); 


            let result;
    
            console.log("\n The status sent in this watchlist axios call: " + this.state.watchlist_status); // debugging
             axios.post(
                '/api/change_watchlist',
                {
                    user_id: this.props._id, 
                    watchlist_status: this.state.watchlist_status // TODO: This is flipped!!!
                },
                {
                    headers: {'Content-type': 'application/json'}
                }
            ).then((data) => {
                console.log("Add to Watch List:" + data);
                result = data['data'];
    
                if (!result) {
                    alert("It didn't work!");
                }
                else {
                   /// alert("Added to Watch List"); // get rid of this later   
                }
            })        

       return;
    }


    returnPicture() {

        if (this.props._id == "5c09f2e5e7179a6ca0843224") { // Jamie
            return (<img src={Jamie} style = {imageStyle} width = "120" height = "120" alt="Profile" />);
        
        }

        if (this.props._id == "5bf8ca52e7179a56e21592c8") { // Gabe
            return (<img src={Gabe} style = {imageStyle} width = "120" height = "120" alt="Profile" />);
        }

        if (this.props._id == "5bf8ca12e7179a56e21592c5") { // Ishan
            return (<img src={Ishan} style = {imageStyle} width = "120" height = "120" alt="Profile" />);
        }

        if (this.props._id == "5c09f2aae7179a6ca08431f1") { // Paulo
            return (<img src={Paulo} style = {imageStyle} width = "120" height = "120" alt="Profile" />);
        }
        
        else { // Placeholder
        return (<img src={PersonPlaceholder} style = {imageStyle} width = "120" height = "120" alt="Profile" />);
        }
    }

    render() {
        const {classes} = this.props;
        // Error messages made me get rid of outer div here
        return (
            <div>

                <Grid 
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing = {8}
                style = {textStyle}
                >
                    <Grid item><p></p></Grid>
                    <Grid item><p></p></Grid>
                    <Grid item>
                        <p>{this.returnPicture()}</p>
                    </Grid>
                    
                    <Grid item>
                        <p>{this.props.name}</p>
                    </Grid>

                    <Grid item>
                        <Button 
                        className={classes.buttonStyle} 
                        variant="contained" 
                        color="primary"
                        onClick={(e) => {window.location.href = "mailto:" + this.props.email + "?subject=[TigerEats] A Message from your nutritionist!&body=Hi " + this.props.name + ",\n";}}
                        >Send Message</Button>    
                    </Grid>
                
                    
                    <Grid item>
                        <Button 
                        className={classes.buttonStyle} 
                        variant="contained" 
                        color="primary"
                        onClick={

                           () => {
                                this.setState({
                                    watchlist_status: !this.state.watchlist_status
                                }, () => {
                                 this.addToWatchList()
                                })
                            }




                        }
                        >
                        {this.state.watchlist_status ? "Remove From Watch List" : "Add To Watch List"}</Button>
                    </Grid>

                    
                    <Grid item><p></p></Grid>

               </Grid>

            

            </div>


        );
    }

})