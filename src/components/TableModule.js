import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHeaderModule from './TableHeaderModule';

let counter = 0;
function createData(name, last_active, gender, class_year, team, meals_logged_per_day, calories, protein, fat, carbs) {
    counter += 1;
    return {id: counter, name, last_active, gender, class_year, team, meals_logged_per_day, calories, protein, fat, carbs};
}

export default class TableModule extends React.Component {

    

    state = {
        entries: 0,
        orderBy: 'name',
        order: 'asc',

    };

    render() {
        return (
            <Table>
                <TableHeaderModule orderBy={this.state.orderBy} order={this.state.order}/>
            </Table>
        );
    }
}