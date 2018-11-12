import React from 'react';
import axios from 'axios';

export default class TigerEatsApp extends React.Component {
    constructor() {
        super();
        this.state = {
            items: [],
            value: '',
            value2: ''
        };

        this.handleChange.bind(this);
        this.handleSubmit.bind(this);
        this.addUser.bind(this);
        this.findUsers.bind(this);

    }

    handleChange = event => {
        this.setState({
            value: event.target.value
        });
    }

    handleChange2 = event => {
        this.setState({
            value2: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.addUser(this.state.value).then(() => {
            this.getList()
        });
    }

    handleSubmit2 = event => {
        event.preventDefault();
        this.getList();
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

    getList = () => {
        this.findUsers().then((data) => {
            this.setState({
                items: data['data']
            })
        })

    }

    findUsers = () => {
        return axios
            .get(
                'api/findUsers',
                {
                    headers: { 'Content-type': 'application/json' }
                }
            )
    }

    
    
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Insert new user: </label>
                    <input type="text" name="name" onChange={this.handleChange}/>
                    <input type="submit" value="Submit" />
                </form>
                <form onSubmit={this.handleSubmit2}>
                    <label>Users (Refresh): </label>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.items.map((res) => (<p>{res['name']}</p>))}
            </div>
        );
    }
}