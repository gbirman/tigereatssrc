import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import DashboardPage from '../components/DashboardPage';
import NavHeader from '../components/NavHeader';
import TestPage from '../components/TestPage'

const AppRouter = () => (
    <BrowserRouter>
        <div> 
            <NavHeader />
            <Switch>
                <Route path="/" component={DashboardPage} exact={true} />
                <Route path="/test" component={TestPage} exact={true} />
            </Switch>
        </div>
    </BrowserRouter>
);

export default AppRouter;