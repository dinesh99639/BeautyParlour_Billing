import React from 'react';
// import ReactDOM from 'react-dom';

import $ from 'jquery';

import './Login.css'

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        // this.login = this.login.bind(this);
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <>
                <div className="sidenav">
                    <div className="login-main-text">
                        <h2>BeautyParler<br /> Login Page</h2>
                        <p>Login from here to access.</p>
                    </div>
                </div>
                <div className="main">
                    <div className="col-md-6 col-sm-12">
                        <div className="login-form">
                            <div className="form-group">
                                <label>User Name</label>
                                <input 
                                    type="text"
                                    id="username"
                                    className="form-control" 
                                    placeholder="User Name" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password"
                                    id="password" 
                                    className="form-control" 
                                    placeholder="Password" />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-black"
                                onClick={()=> {this.props.login($('#username').val(), $('#password').val())}}
                            >Login</button>
                            {/* <button type="submit" className="btn btn-secondary">Register</button> */}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Login;
