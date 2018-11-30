import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { NavLink } from 'react-router-dom';


function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a,b) => {
        const order = cmp(a[0], b[0]);
        if (order != 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a,b) => desc(a,b,orderBy) : (a,b) => -desc(a,b,orderBy);
}

export default class TableBodyModule extends React.Component {
    isSelected = property => {
        console.log('success');
    }

    render () {
        return (
            <TableBody>
                {
                    stableSort(this.props.data, getSorting(this.props.order, this.props.orderBy))
                        .map(n => {
                            return (
                                <TableRow
                                    hover
                                    onClick={event => this.isSelected(n.id)}
                                    tabIndex={-1}
                                    key={n.id}
                                >
                                    <TableCell>
                                        <NavLink to="/test" style={{textDecoration: 'none'}}>{n.name}</NavLink>
                                    </TableCell>
                                    <TableCell>{n.last_active}</TableCell>
                                    <TableCell>{n.gender}</TableCell>
                                    <TableCell>{n.class_year}</TableCell>
                                    <TableCell>{n.team}</TableCell>
                                    <TableCell>{n.meals_logged_per_day}</TableCell>
                                    <TableCell>{n.calories}</TableCell>
                                    <TableCell>{n.protein}</TableCell>
                                    <TableCell>{n.fat}</TableCell>
                                    <TableCell>{n.carbs}</TableCell>
                                </TableRow>
                            );
                        })
                }
                
            </TableBody>
        );
    }
}