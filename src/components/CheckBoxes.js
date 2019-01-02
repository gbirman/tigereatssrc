import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import {themecolors, nutrientcolors} from '../styles/color';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

const styles = (theme) => ({
    root: {
        padding: 0,
    },
    calories: {
        color: nutrientcolors.calories,
        '&$checked': {
            color: nutrientcolors.calories
        }
    },
    carbs: {
        color: nutrientcolors.carbs,
        '&$checked': {
            color: nutrientcolors.carbs
        }
    },
    fat: {
        color: nutrientcolors.fat,
        '&$checked': {
            color: nutrientcolors.fat
        },
    },
    protein: {
        color: nutrientcolors.protein,
        '&$checked': {
            color: nutrientcolors.protein
        },
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
        //display: "flex",
        //alignItems: "center",
    },
    group: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100%"
    }
});

const CheckboxLabels = (props) => {

  const minwidth = useMediaQuery(`(min-width:${props.theme.breakpoints.values.lg}px)`);

  const {classes} =  props;
  const [state, setState] = React.useState({
    calories: true,
    carbs: true,
    fat: true,
    protein: true,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
    props.toggleChannelShow(name);
  };

  return (
    <Paper className={classes.paper} elevation={props.smallScreen ? 0 : 1}>
        <FormGroup row className={classes.group}>
            <FormControlLabel
                control={
                <Checkbox
                    checked={state.calories}
                    onChange={handleChange('calories')}
                    value="calories"
                    className={classnames(classes.root, classes.calories, classes.checked)}
                />
                }
                label={minwidth ? "Calories" : ""}
                labelPlacement="top"
                classes={{label: classnames(classes.calories, classes.root)}}
            />
            <FormControlLabel
                control={
                <Checkbox
                    checked={state.carbs}
                    onChange={handleChange('carbs')}
                    value="carbs"
                    className={classnames(classes.root, classes.carbs, classes.checked)}
                />
                }
                label={minwidth ? "Carbs" : ""}
                labelPlacement="top"
                classes={{label: classnames(classes.carbs, classes.root)}}
            />
            <FormControlLabel
                control={
                <Checkbox
                    checked={state.fat}
                    onChange={handleChange('fat')}
                    value="fat"
                    className={classnames(classes.root, classes.fat, classes.checked)}
                />
                }
                label={minwidth ? "Fat" : ""}
                labelPlacement="top"
                classes={{label: classnames(classes.fat, classes.root)}}
            />
            <FormControlLabel
                control={
                <Checkbox
                    checked={state.protein}
                    onChange={handleChange('protein')}
                    value="protein"
                    className={classnames(classes.root, classes.protein, classes.checked)}
                />
                }
                label={minwidth ? "Protein" : ""}
                labelPlacement="top"
                classes={{label: classnames(classes.protein, classes.root)}}
            />
        </FormGroup>
    </Paper>
  );
}

export default withStyles(styles, { withTheme: true })(CheckboxLabels);