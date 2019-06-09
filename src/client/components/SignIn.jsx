import React from 'react'
import LabbelledInput from './common/LabbelledInput.jsx'
import Button from './common/Button.jsx';
import { newUserChangeActionCreator } from '../redux/actions'
import { connect } from 'react-redux'
import axios from "axios"

class SignIn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userName : '',
            password : ''
        };
        this.register = this.register.bind(this);
        this.updateUserName = this.updateUserName.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.newUserClick = this.newUserClick.bind(this)
        this.enterPressed = this.enterPressed.bind(this)

    }
    updateUserName(event) {
        this.setState({ userName : event.target.value })
    }
    updatePassword(event) {
        this.setState({ password : event.target.value })
    }
    register(event) {
        console.log("intialUserName" , this.state.userName)
        console.log("intialpassword" , this.state.password)
        axios.post("/signin", {
          username: this.state.userName, //13245
          password: this.state.password // 1234567890
        })
        .then(function(response) {
          window.location.href = response.request.responseURL;
        })
        .catch(function(error) {
          console.log(error);
        })
     }
     enterPressed(event){
         console.log(event)
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
           this.register()
        } 
     }

     newUserClick() {
       this.props.newUserChange(true)
     }
        
    render(){

        return(
            <div>
                <LabbelledInput labelName ="UserName" inputType="text" updateInput={this.updateUserName}/>
                <LabbelledInput labelName ="Password" inputType="password" updateInput={this.updatePassword} enterPressed={this.enterPressed}/>
                <Button inputType="button" onClick={this.register} buttonName="LOG IN"/>
                <Button inputType="button" onClick={this.newUserClick} buttonName="NEW USER"/>
            </div>
        )
    }


}
const mapDispatchToProps = dispatch => {
    return {
        newUserChange: (newUser) => dispatch(newUserChangeActionCreator(newUser))
    }
}
export default connect(undefined,mapDispatchToProps)(SignIn)