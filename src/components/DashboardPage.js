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
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    table: {
        overflowX: 'auto', 
        marginTop: '5vh',
        marginRight: '2vh',
        marginLeft: '2vh',
        border: 'solid',
        borderColor: '#59bf8e',
    },
    personIcon: {
        color: "#59BF8E",
        marginRight: '3vh'
    },
    searchField: {
        color: '#4CA279',
        fontFamily: 'Karla, sans-serif',
    },
    searchFieldLabel: {
        color: '#4CA279',
        fontFamily: 'Karla, sans-serif',
    },
    searchUnderline: {
        color: 'red !important'
    }

})

export default withStyles(styles)(class DashboardPage extends React.Component {

    state = {
        restrictions: {name: ""},
        data: []
    };

    getUsers = () => {
        axios.get(
            '/api/getUsers',
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
        const {classes} = this.props;
        return (
            <div>
                <FilterExpansionsModule 
                    onFilter={this.handleFilterRequest}
                />
                <Paper className={classes.table}>
                    <Toolbar>
                        <Grid container item justify="flex-end" alignItems="flex-end">
                            <Grid item><AccountCircle className={classes.personIcon}/></Grid>
                            <Grid item><TextField InputLabelProps={{classes: {root: classes.searchFieldLabel}}} InputProps={{classes: {input: classes.searchField, underline: classes.searchUnderline}}} className={classes.searchField} id="input-with-icon-grid" label="Search for students..." onKeyUp={this.handleSearchChange}/></Grid>
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
})