import React from 'react';
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


    returnPicture() {

        if (this.props.user_id == "5c09f2e5e7179a6ca0843224") { // Jamie
            return (<img src={Jamie} style = {imageStyle} width = "120" height = "120" alt="Profile" />);
        
        }

        if (this.props.user_id == "5bf8ca52e7179a56e21592c8") { // Gabe
            return (<img src={Gabe} style = {imageStyle} width = "120" height = "120" alt="Profile" />);
        }

        if (this.props.user_id == "5bf8ca12e7179a56e21592c5") { // Ishan
            return (<img src={Ishan} style = {imageStyle} width = "120" height = "120" alt="Profile" />);
        }

        if (this.props.user_id == "5c09f2aae7179a6ca08431f1") { // Paulo
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
                        onClick={() => { alert("Added to Watch List")}}
                        >
                        Add To Watch List</Button>
                    </Grid>

                    
                    <Grid item><p></p></Grid>

               </Grid>

            

            </div>


        );
    }

})