import React from 'react';
import TigerButton from './TigerButton';
import axios from 'axios';

export default class TigerEatsApp extends React.Component {
    constructor() {
        super();
        this.state = {
            items: [],
            value: ''
        };

        this.handleChange.bind(this);
        this.handleSubmit.bind(this);
        this.addUser.bind(this);

    }

    handleChange = event => {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.addUser(this.state.value);
    }

    addUser = (user) => {
        return axios
            .post(
                'api/addUser',
                {
                    user: user
                },
                {
                    headers: { 'Content-type': 'application/json' }
                }
            ).then((response) => {
                console.log(response)
            }).catch((response) => {
                console.log(response);
            });
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="name" onChange={this.handleChange}/>
                    <input type="submit" value="Submit" />
                </form>
                <TigerButton />
            </div>
        );
    }
}