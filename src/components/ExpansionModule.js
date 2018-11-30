import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

// ON QUERY, SEND BACK LIST OF PARAMS FOR EACH FIELD THAT CAN BE INCLUDED, AS OPPOSED THAT CANT BE


export default class ExpansionModule extends React.Component {
    state = {
        options: [],
        queryParams: [],
        clickedChips: []
    };

    componentDidMount() {
        let ops = [];

        // take the prop giving the criteria, query the db for all the unique values of that variable, 
        // and put them in a sorted array
        if (this.props.criteria === 'gender') {
            ops = ['Male', 'Female'];
            /* ops = axios.get(
                '/api/get_user_gender',
                {
                    userId: 'gender'
                },
                {
                    headers: {'Content-type': 'application/json'}
                }
            ).then((response) => {console.log(response)}).catch((response) => {console.log(response)}); */
        }
        else if (this.props.criteria === 'team') {
            ops = ['Soccer', 'Bball', 'Tennis'];
            /*ops = axios.get(
                '/api/get_user_team',
                {
                    userId: 'team'
                },
                {
                    headers: {'Content-type': 'application/json'}
                }
            ).then((response) => {console.log(response)}).catch((response) => {console.log(response)}); */
        }
        else if (this.props.criteria === 'class_year') {
            ops = [2019, 2020, 2021, 2022];
            /*ops = axios.get(
                '/api/get_user_year',
                {
                    userId: 'year'
                },
                {
                    headers: {'Content-type': 'application/json'}
                }
            ).then((response) => {console.log(response)}).catch((response) => {console.log(response)}); */
        }

        // set clicked array
        let bools = [];
        let op;
        for (op in ops) bools.push(true);

        this.setState(() => ({
            options: ops,
            queryParams: ops,
            clickedChips: bools
        }));
    }

    handleChipClick = (option) => {
        console.log(option);

        const index = this.state.options.indexOf(option);
        console.log(index);

        const newBools = this.state.clickedChips.slice();
        newBools[index] = !this.state.clickedChips[index];

        this.setState(() => ({
            clickedChips: newBools
        }))
    };

    render() {

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{this.props.criteria}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container>
                        {
                            this.state.options.map((option) => {
                                const index = this.state.options.indexOf(option);
                                const clicked = this.state.clickedChips[index];
                                 return <Chip label={option} icon={clicked ? <DoneIcon /> : <CloseIcon />} clickable
                                            onClick={(e) => {this.handleChipClick(option)}} />;
                        })
                        }
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>  
        );
    }
}