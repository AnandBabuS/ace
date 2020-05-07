import React , { Component } from 'react';
import { connect } from 'react-redux'
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';

class LoginForm extends Component {
    render(){
        const newUser = this.props.newUser;
        return(
            <div className="login-wrapper">
                <label className="title">Welcome to Ace</label>
                {newUser?(<SignUp/>):(<SignIn/>)}
            </div>
        )
    
    }
}

const mapStateToProps = (state) => {
    return {
        newUser: state.newUser
    }
}


export default connect(mapStateToProps)(LoginForm)