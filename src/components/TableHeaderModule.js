import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';


const rows = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'last_active', numeric: false, disablePadding: true, label: 'Last Active' },
    { id: 'gender', numeric: false, disablePadding: true, label: 'Gender' },
    { id: 'class_year', numeric: false, disablePadding: true, label: 'Class Year' },
    { id: 'team', numeric: false, disablePadding: true, label: 'Team' },
    { id: 'meals_logged_per_day', numeric: false, disablePadding: true, label: 'Meals Logged / Day'},
    { id: 'calories', numeric: false, disablePadding: true, label: 'Calories'},
    { id: 'protein', numeric: false, disablePadding: true, label: 'Protein'},
    { id: 'fat', numeric: false, disablePadding: true, label: 'Fat'},
    { id: 'carbs', numeric: false, disablePadding: true, label: 'Carbs'}
  ];
  
export default class TableHeaderMoudle extends React.Component {

    render() {
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                    </TableCell>
                    {rows.map((row) => {
                        return (
                            <TableCell
                                key={row.id}
                                numeric={row.numeric}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={this.props.orderBy === row.id ? this.props.order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                >
                                    <TableSortLabel
                                        active={this.props.orderBy === row.id}
                                        direction={this.props.order}
                                        onClick={(e) => {console.log(row.label)}}
                                    >
                                        <h3>{row.label}</h3>
                                    </TableSortLabel>
                                </Tooltip>   
                            </TableCell>
                        );
                    })}

                </TableRow>
            </TableHead>
        );
    }
    
    
} 