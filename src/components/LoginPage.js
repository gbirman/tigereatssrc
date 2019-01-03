import React from 'react';
import FilterExpansionsModule from './FilterExpansionsModule';
import TableModule from './TableModule';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import logo from '../images/tiger_eats_graphic.png'

const styles = theme => ({
    loginButton: {
        fontFamily: 'Karla, sans-serif',
        color: 'white',
        border: 'solid',
        borderColor: '#d9f495'
    },
    icon: {
        height: '180px', // responsive height is 30vh, 180px
        marginTop: '15vh',
        marginBottom: '5vh'
    },
    welcomePaper: {
        fontFamily: 'Karla, sans-serif',
        width: '30vw',
        borderStyle: 'solid',
        backgroundColor: "#59bf8e",
        color: "white",
        borderColor: '#d9f495',
        paddingRight: '5vw',
        paddingLeft: '5vw',
        textAlign: 'center',
        marginBottom: '5vh',
    }

})



export default withStyles(styles)(class LoginPage extends React.Component {

    state = {
        email: undefined,
        password: undefined,
    };

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
        console.log(e.target.value);
    }

    handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
        console.log(this.props.theme);
    }

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
                    <Grid item xs={3} >
                        <Button className={classes.loginButton} variant="contained" color="primary" href='http://localhost:5000/cas'>Login with CAS</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
})