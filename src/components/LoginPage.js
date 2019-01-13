import React from 'react';
import FilterExpansionsModule from './FilterExpansionsModule';
import TableModule from './TableModule';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import logo from './images/tiger_eats_graphic.png'

const styles = theme => ({
    loginButton: {
        fontFamily: 'Karla, sans-serif',
        color: 'white',
        border: 'solid',
        borderColor: '#d9f495',
        fontSize: '1em',
        paddingTop: '1vh',
        paddingBottom: '1vh'
    },
    icon: {
        height: '180px', // responsive height is 30vh, 180px
        marginTop: '5vh',
        marginBottom: '4vh'
    },
    welcomePaper: {
        fontFamily: 'Karla, sans-serif',
        width: '40vw',
        borderStyle: 'solid',
        backgroundColor: "#59bf8e",
        color: "white",
        borderColor: '#d9f495',
        paddingRight: '5vw',
        paddingLeft: '5vw',
        textAlign: 'center',
        marginBottom: '3vh',
    },
    inputPaper: {
        border: 'solid',
        borderColor: '#59bf8e',
        color: '#3e8563',
        fontFamily: 'Karla, sans-serif',
        paddingRight: '3vw',
        paddingLeft: '3vw',
        paddingBottom: '3vh',
        marginBottom: '3vh',
        width: '40vw'
    },
    searchField: {
        color: '#3e8563',
        fontFamily: 'Karla, sans-serif',
    },
    searchFieldLabel: {
        color: '#3e8563',
        fontFamily: 'Karla, sans-serif',
    },
    searchUnderline: {
        color: 'red !important'
    }

})

// () => axios.get('/login_casclient').then((data) => {console.log(data)}).catch((error) => {console.error(error);})



export default withStyles(styles)(class LoginPage extends React.Component {

    state = {
        email: undefined,
        password: undefined,
        isClicked: false
    };

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
        console.log(e.target.value);
    }

    handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
    }

    handleClick = event => {
        let url = "https://tigereats.herokuapp.com/login";

        fetch(url, {
          method: "GET",
          header: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          dataType: "json"
        })
          .then(response => console.log(response.status))
        console.log("posting that we are logging in to server....");
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                >
                    <img className={classes.icon} src={logo} />
                    <Paper color="primary" className={classes.welcomePaper}>
                        <div><h1>Welcome to <span style={{padding: 0, margin: 0, color: "#d9f495"}}>Tiger</span>Eats!</h1></div>
                    </Paper>
                    <Paper className={classes.inputPaper}>
                        <h3 style={{marginBottom: '0'}}>Please enter your Princeton email and password:</h3>
                        <Grid item style={{marginBottom: '2%'}}>
                            <TextField InputLabelProps={{classes: {root: classes.searchFieldLabel}}} InputProps={{classes: {input: classes.searchField, underline: classes.searchUnderline}}} fullWidth={true} label="Email" onKeyUp={this.handleEmailChange} placeholder='i.e. netid@princeton.edu'></TextField>
                        </Grid>
                        <Grid item style={{marginBottom: '2%'}}>
                            <TextField InputLabelProps={{classes: {root: classes.searchFieldLabel}}} InputProps={{classes: {input: classes.searchField, underline: classes.searchUnderline}}} label="Password" type="password" onKeyUp={this.handlePasswordChange} fullWidth={true}></TextField>
                        </Grid>
                    </Paper>
                    <Grid item xs={3} >
                        <Button className={classes.loginButton} variant="contained" color="primary" href='http://localhost:5000/api/login_casclient'>Login with CAS</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
})