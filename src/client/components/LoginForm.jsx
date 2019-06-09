import React , { Component } from 'react';
import { connect } from 'react-redux'
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';

class LoginForm extends Component {
     
    render(){
        const newUser = this.props.newUser;
        var myStyle = {
            border: '3px double grey',
            textAlign: 'center',
            marginTop: '15%',
            width: '50%',
            marginLeft: '25%',
            height: '300px',
            background:' whitesmoke'
         }
         var title={
            display: 'inline-block',
            margin:'20px',
            fontSize: 'xx-large'
         }
        
        return(
            <div style={myStyle}>
                <label style={title}>FORM</label>
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