import React from 'react';

import axios from 'axios';

import config from "../config.json";

import { Snackbar } from '@material-ui/core';

import Error500 from './ErrorPages/Error500';
import Login from './Auth/Login';
import DashboardIndex from './Dashboard/DashboardIndex';
import AdminIndex from './Admin/AdmnIndex';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: null
        }

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);

        this.showMessage = this.showMessage.bind(this);
        this.hideMessage = this.hideMessage.bind(this);
        
        this.pages= {
            loginPage: <Login login={this.login} />,
            dashboardPage: <DashboardIndex logout={this.logout} />,
            adminPage: <AdminIndex logout={this.logout} />,
            error500: <Error500 />
        }
    }

    async componentDidMount() {
        var content = null;
        var session = null;
        var userData = localStorage.getItem('userData');
        
        if (userData) {
            userData = JSON.parse(userData);
            // console.log(userData);
            if (userData.data.username === "admin") content = this.pages.adminPage;
            else if (userData.data.username === "receptionist") content = this.pages.dashboardPage;

        }
        else content = this.pages.loginPage;

        this.setState({ content, session });
    }

    async login(username, password) {
        // console.log(config.HOST+'/api/auth.php');
        var res = await axios.post(config.HOST+'/api/auth.php', { 
            login: true, 
            username: username, 
            password: password 
        });

        var data = res.data;
        var content = null;
        
        if (!data.error) {
            localStorage.setItem('userData', JSON.stringify(data));

            if (data.data.username === "admin") content = this.pages.adminPage;
            else if (data.data.username === "receptionist") content = this.pages.dashboardPage;

            console.log(data);

            this.setState({ content });
            this.showMessage("Successfully Loggedin");
        }
        else {
            this.showMessage("Invalid Credentials");
            // localStorage.removeItem("userData");
        }
    }
    
    async logout () {
        var session = this.state.session;
        var res = await axios.post(config.HOST+'/api/logout.php', { session });
        if (res) localStorage.removeItem("userData");

        this.setState({ content: this.pages.loginPage });
    }

    showMessage(message) {
        this.setState({ showSuccessMessage: true, snackMessage: message, showPrintPreview: true });
    }

    hideMessage() {
        this.setState({ showSuccessMessage: false });
    }

    render() {
        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={this.state.showSuccessMessage}
                    onClose={this.hideMessage}
                    message={this.state.snackMessage}
                    autoHideDuration={2000}
                />

                {this.state.content}
            </div>
        );
    }
}

export default App;