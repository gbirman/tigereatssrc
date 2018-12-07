import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import DashboardPage from '../components/DashboardPage';
import NavHeader from '../components/NavHeader';
import StudentGoalsPage from '../components/StudentGoalsPage';
import ChangeGoalsPage from '../components/ChangeGoalsPage'

const AppRouter = () => (
    <BrowserRouter>
        <div> 
            <NavHeader />
            <Switch>
                <Route path="/" component={DashboardPage} exact={true} />
                <Route path="/test" component={StudentGoalsPage} exact={true} />
                <Route path="/changeGoals/:id/:fullname/:calorie_goal" component={ChangeGoalsPage} />
            </Switch>
        </div>
    </BrowserRouter>
);

export default AppRouter;