import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Link, NavLink } from 'react-router-dom';
import EmailIcon from '@material-ui/icons/Email';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    row: {
        fontFamily: 'Karla, sans-serif',
        borderTopStyle: 'solid',
        borderTopWidth: '2px',
        borderTopColor: '#4CA279',
    },
    cell: {
        textAlign: 'center',
        color: "#59BF8E",
    },
    linkCell: {
        textDecoration: 'none',
        color: '#59BF8E'
    },
    iconCell: {
        color: '#3e8563',
        cursor: "pointer"
    },
    nameCell: {
        textDecoration: 'none',
        color: '#4CA279'
    }
});


function stableSort(array, cmp) {
    console.log(array);
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


export default withStyles(styles)(class TableBodyModule extends React.Component {
    isSelected = property => {
        console.log('success');
    }

    render () {
        const {classes} = this.props;
        return (
            <TableBody >
                { 
                    stableSort(this.props.data, getSorting(this.props.order, this.props.orderBy))
                        .map(n => {
                            
                            return (
                                    <TableRow
                                        hover
                                        onClick={event => this.isSelected(n.id)}
                                        tabIndex={-1}
                                        key={n.id}
                                        className={classes.row}
                                        
                                    >
                                        <TableCell >
                                            <NavLink
                                                className={classes.nameCell}
                                                to={"/test/" + n._id}
                                            >
                                                {n.fullname}
                                            </NavLink> 
                                        </TableCell>
                                        <TableCell className={classes.cell}>{n.gender}</TableCell>
                                        <TableCell className={classes.cell}>{n.year}</TableCell>
                                        <TableCell className={classes.cell}>{n.team}</TableCell>
                                        <TableCell className={classes.cell}>{"Placeholder"}</TableCell>
                                        <TableCell className={classes.cell}>
                                            <NavLink
                                                to={"/changeGoals/" + n._id + "/" + n.fullname + "/" + n.calorie_goal + "/" + n.protein_goal + "/" + n.fats_goal + "/" + n.carbs_goal}
                                                className={classes.linkCell}
                                            >
                                                {n.calorie_goal}
                                            </NavLink> 
                                        </TableCell>
                                        <TableCell className={classes.cell}>
                                            <NavLink
                                                to={"/changeGoals/" + n._id + "/" + n.fullname + "/" + n.calorie_goal + "/" + n.protein_goal + "/" + n.fats_goal + "/" + n.carbs_goal}
                                                className={classes.linkCell}
                                            >
                                                {n.protein_goal}
                                            </NavLink> 
                                        </TableCell>
                                        <TableCell className={classes.cell} style={{textAlign: 'center'}}>
                                            <NavLink
                                                to={"/changeGoals/" + n._id + "/" + n.fullname + "/" + n.calorie_goal + "/" + n.protein_goal + "/" + n.fats_goal + "/" + n.carbs_goal}
                                                className={classes.linkCell}
                                            >
                                                {n.carbs_goal}
                                            </NavLink> 
                                        </TableCell>
                                        <TableCell className={classes.cell}>
                                            <NavLink
                                                to={"/changeGoals/" + n._id + "/" + n.fullname + "/" + n.calorie_goal + "/" + n.protein_goal + "/" + n.fats_goal + "/" + n.carbs_goal}
                                                className={classes.linkCell}
                                            >
                                                {n.fats_goal}
                                            </NavLink> 
                                        </TableCell>
                                        <TableCell className={classes.iconCell}>
                                            <EmailIcon 
                                                clickable="true"
                                                style={{}} 
                                                onClick={(e) => {window.location.href = "mailto:" + n.email + "?subject=[TigerEats] A Message from your nutritionist!&body=Hi " + n.firstname + ",\n";}}
                                            />
                                        </TableCell>
                                        
                                    </TableRow>
                            );
                        })
                }
                
            </TableBody>
        );
    }
})