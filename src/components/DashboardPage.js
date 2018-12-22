import React from 'react';
import FilterExpansionsModule from './FilterExpansionsModule';
import TableModule from './TableModule';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';

export default class DashboardPage extends React.Component {

    state = {
        restrictions: {name: ""},
        data: []
    };

    getUsers = () => {
        axios.get(
            'http://127.0.0.1:5000/api/getUsers',
            {
                params: {
                    restrictions: this.state.restrictions,
                }
            },
            {
                headers: {'Content-type': 'application/json'}
            }
        ).then((data) => {
            let details = data['data'];
            details.map((n) => {
                const full_name = n.firstname + " " + n.lastname;
                n['fullname'] = full_name;
            });
            console.log('users updated');

            this.setState({data: data['data']});
        })}

    handleSearchChange = (e) => {
        let rest = this.state.restrictions;

        rest['name'] = e.target.value;

        this.setState({restrictions: rest});

        this.getUsers();
    }

    handleFilterRequest = (field, value) => {
        let rest = this.state.restrictions;
        

        // value is in restrictions, so removes it, and potentially field too
        if (field in rest && rest[field].includes(value)) {
            const index = rest[field].indexOf(value);
            rest[field].splice(index, 1);

            if (rest[field].length === 0) {
                delete rest[field];
            }
        }
        

        // value is not in restrictions, so adds it
        else if (field in rest && !rest[field].includes(value)) {
            rest[field].push(value);
        }

        // field isn't in restrictions, so adds it and value
        else {
            rest[field] = [value];
        }
        console.log(rest);

        this.setState({
            restrictions: rest
        });

        this.getUsers();
    } 

    render() {
        return (
            <div>
                <FilterExpansionsModule 
                    onFilter={this.handleFilterRequest}
                />
                <Paper style={{overflowX: 'auto', marginTop: '5vh'}}>
                    <Toolbar>
                        <Grid container item justify="flex-end" alignItems="flex-end">
                            <Grid item><AccountCircle /></Grid>
                            <Grid item><TextField id="input-with-icon-grid" label="Search for students..." onKeyUp={this.handleSearchChange}/></Grid>
                        </Grid>
                    </Toolbar>
                    <TableModule 
                        restrictions={this.state.restrictions}
                        getUsers={this.getUsers}
                        data={this.state.data}
                    />
                </Paper>
            </div>
        );
    }
}