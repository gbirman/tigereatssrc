import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import {themecolors} from '../styles/color';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

const styles = theme => ({
    root: {
        padding: 0,
    },
    daily: {
        color: theme.palette.primary.light,
        '&$checked': {
            color: theme.palette.primary.light
        }
    },
    weekly: {
        color: theme.palette.primary.light,
        '&$checked': {
            color: theme.palette.primary.light
        }
    },
    monthly: {
        color: theme.palette.primary.light,
        '&$checked': {
            color: theme.palette.primary.light
        }
    },
    checked: {}, 
    paper: {
        //...theme.mixins.gutters(),
        //paddingTop: theme.spacing.unit * 2,
        //paddingBottom: theme.spacing.unit * 2,
        backgroundColor: `${themecolors.darkgray}`,
        [theme.breakpoints.down('sm')]: {
            height: "40px",
        },
        height: "100%",
        //width: "100%"
    },
    group: {
        display: "flex",
        //flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
    }
});

const FormControlLabelPosition = (props) => {
    const {classes} =  props;
    const [value, setValue] = React.useState('day');

    const minwidth = useMediaQuery(`(min-width:${props.theme.breakpoints.values.sm}px)`);

    const handleChange = (event) => {
        setValue(event.target.value);
        if (event.target.value === "day") {
            props.setWindowDay();
        } else if (event.target.value === "week") {
            props.setWindowWeek();
        } else if (event.target.value === "month") {
            props.setWindowMonth();
        }
    }

  return (
    <Paper className={classes.paper} elevation={props.smallScreen ? 0 : 1}>
        <FormControl 
            component="fieldset"
            style={{width: "100%"}}
        >
            <RadioGroup 
                aria-label="position" 
                name="position" 
                value={value} 
                onChange={handleChange} 
                row={true}
                className={classes.group}
            >
                <FormControlLabel
                value="day"
                control={<Radio className={classnames(classes.root, classes.daily, classes.checked)}/>}
                label={minwidth ? "Daily" : "D"}
                labelPlacement={minwidth ? "top" : "top"}
                classes={{label: classes.daily}}
                />
                <FormControlLabel
                value="week"
                control={<Radio color="primary" className={classnames(classes.root, classes.weekly, classes.checked)} />}
                label={minwidth ? "Weekly" : "W"}
                labelPlacement={minwidth ? "top" : "top"}
                classes={{label: classes.weekly}}
                />
                <FormControlLabel
                value="month"
                control={<Radio color="primary" className={classnames(classes.root, classes.monthly, classes.checked)} />}
                label={minwidth ? "Monthly" : "M"}
                labelPlacement={minwidth ? "top" : "top"}
                classes={{label: classes.monthly}}
                />
            </RadioGroup>
        </FormControl>
    </Paper>
  );
}

export default withStyles(styles, { withTheme: true })(FormControlLabelPosition);