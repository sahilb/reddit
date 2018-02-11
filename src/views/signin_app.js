import React from 'react';
import { FieldGroup } from 'react-bootstrap';
import xhr from 'xhr';
import Header from './header'

class SignInApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invalid: {},
            username: '',
            password: '',
            submitAttempts: 0,
        };
    }
    handleUserNameChange(ev) {
        const val = ev.target.value;
        this.setState({
            username: val
        })
    }
    handleUserPasswordChange(ev) {
        const val = ev.target.value;
        this.setState({
            password: val
        })
    }
    onClick() {
        console.log('clicked')
    }

    validate() {

        const { username, password, submitAttempts } = this.state;
        if (submitAttempts == 0) {
            return
        }
        if (!username.length && !password.length) {
            this.setState({ invalid: { username: true, password: true } })
        } else if (!username.length) {
            this.setState({ invalid: { username: true, password: false } })
        } else if (!password.length) {
            this.setState({ invalid: { username: false, password: true } })
        } else {
            this.setState({ invalid: { username: false, password: false } })
            return true;
        }
    }
    submit() {
        console.log('submitting');
        const { submitAttempts } = this.state;
        this.setState({
            submitAttempts: submitAttempts + 1
        }, () => {
            if (this.validate()) {
                const callback = (err, resp, json) =>{
                    if(resp && resp.statusCode == 401){
                        this.setState({
                            serverMessage: 'Invalid Credentials'
                        })
                        return;
                    }
                    if (err) {
                        this.setState({
                            serverMessage: err
                        })
                        return
                    }
                    const { success, serverMessage } = json
                    if (success) {
                        window.location.href = window.location.origin + '/homepage'
                    } else {
                        this.setState({
                            serverMessage
                        })
                    }
                }
                const {username, password} = this.state;
                xhr({
                    method: 'post',
                    body: JSON.stringify({username, password}),
                    uri: '/' + this.props.uri + '?' + 'username=' + this.state.username + '&' + 'password=' + this.state.password,
                    headers: { 'Content-Type': 'application/json' },
                    json: true
                }, callback)

            } else {
                return false;
            }
        })

    }
    handleKeyUp(ev) {
        const { keyCode } = ev;
        this.validate();
        if (keyCode == 13) {
            this.submit();
        }
    }
    render() {
        const defaultClass = 'row form-control'
        const usernameClassName = defaultClass + (this.state.invalid.username ? ' invalid' : '')
        const passwordClassName = defaultClass + (this.state.invalid.password ? ' invalid' : '');

        return (
            <div>
                <Header  otherUri={this.props.otherUri} otherTitle={this.props.otherTitle} />
                <div className="jumbotron signin">
                    <form className="form-signin" >
                        <label htmlFor="userName" className="sr-only">User Name</label>
                        <input type="name" name="username" id="username" placeholder="User Name" autoFocus
                            className={usernameClassName}
                            onKeyUp={this.handleKeyUp.bind(this)}
                            onChange={this.handleUserNameChange.bind(this)}
                        />
                        <input type="password" name="password" id="password"
                            className={passwordClassName} placeholder="Password"
                            onKeyUp={this.handleKeyUp.bind(this)}
                            onChange={this.handleUserPasswordChange.bind(this)}
                        />
                        <button id="btnSignUp" className="row row-btn btn btn-lg btn-primary btn-block"
                            type="button"
                            onClick={this.submit.bind(this)}
                        >{this.props.title}</button>
                        <div className="serverMessage row">
                            {this.state.serverMessage}
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}


export default SignInApp;
