import React from 'react';
import Button from '@material-ui/core/Button';
import PersonPic from './images/Jamie.jpg';
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


export default withStyles(styles)(class PersonTile extends React.Component {


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
                        <img src={PersonPic} width = "100" height = "100" alt="Profile" />
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