import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import DashboardPage from '../components/DashboardPage';
import NavHeader from '../components/NavHeader';
import StudentGoalsPage from '../components/StudentGoalsPage';
import ChangeGoalsPage from '../components/ChangeGoalsPage';
import ProgressPage from '../components/ProgressPage';
import TestPage from '../components/TestPage';
import LoginPage from '../components/LoginPage';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import amber from '@material-ui/core/colors/amber';
import createPalette from '@material-ui/core/styles';
import createTypography from '@material-ui/core/Typography';
import axios from 'axios';



const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#59BF8E",
            light: "#7acba4",
            dark: "#3e8563"
        },
        secondary: {
            main: "#d9f495",
            light: "#e0f6aa",
            dark: "#97aa68"
        }
    },
    typography: [
        'Raleway',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','), 
});
console.log(theme);

export default class AppRouter extends React.Component {

    state = {
        renderHeader: true,
    }

    handleLogin = (e) => {
        this.setState({renderHeader: true});
        axios.get(
            'http://127.0.0.1:5000/api/cas_redirect',
            {
                headers: {'Content-type': 'application/json'}
            }
        ).then((data) => {
            console.log(data);
        })
    }

    handleLogout = (e) => {
        this.setState({renderHeader: false}, () => {console.log(this.state.renderHeader);});
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <div> 
                        {(this.state.renderHeader) ? <NavHeader onLogout={this.handleLogout}/> : null}
                        <Switch>
                            <Route path="/" render={(props) => <LoginPage {...props} onLogin={this.handleLogin} onLogout={this.handleLogout}/>} exact={true} />
                            <Route path="/dash" exact component={DashboardPage} />
                            <Route path="/test/:id" component={StudentGoalsPage} exact={true} />
                            <Route path="/changeGoals/:id/:fullname/:calorie_goal/:protein_goal/:fats_goal/:carbs_goal" component={ChangeGoalsPage} />
                            <Route path={"/verified/true"} component={DashboardPage} exact/>
                            <Route path="/progress/:id" component={ProgressPage} exact={true} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </MuiThemeProvider>
        )
    }

}