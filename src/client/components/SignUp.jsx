import React from 'react'
import LabbelledInput from './common/LabbelledInput.jsx';
import Button from './common/Button.jsx';
import axios from "axios"

class SignUp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            initialUserName : '',
            initialPassword : '',
            initialConfirmPassword : ''
        };
        this.register = this.register.bind(this);
        this.updateUserNameInput = this.updateUserNameInput.bind(this)
        this.updatePasswordInput = this.updatePasswordInput.bind(this)
        this.updateConfirmPasswordInput = this.updateConfirmPasswordInput.bind(this)
        this.enterPressed = this.enterPressed.bind(this)

    }
    updateUserNameInput(event){
        this.setState({initialUserName : event.target.value})
    }
    updatePasswordInput(event){
        this.setState({initialPassword : event.target.value})
    }
    updateConfirmPasswordInput(event){
        this.setState({initialConfirmPassword : event.target.value})
    }
    register(event) {
        if(!this.state.initialUserName || !this.state.initialPassword || !this.state.initialConfirmPassword){
            alert("Data insufficient")
            return;
        }
        else if(this.state.initialPassword != this.state.initialConfirmPassword){
           alert("password doesnt match")
            this.setState({ initialPassword:"", initialConfirmPassword:"" })
        }
        else{
            axios.post("/signup", {
                username: this.state.initialUserName, // 12345
                password: this.state.initialPassword // 1234567890
              })
              .then((response) => {
                axios.post("/signin", {
                    username: this.state.initialUserName, // 12345
                    password: this.state.initialPassword // 1234567890
                  }).then(function(response) {
                    window.location.href = response.request.responseURL;
                  })
                  .catch(function(error) {
                    console.log(error);
                  })
              })
              .catch(function(error) {
                console.log(error);
              })

        }

        
     }
     newUserClick(){
       this.props.newUserChange(true)
     }
     enterPressed(event){
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
          this.register()
        } 
     }   
    render(){
            return(
                <div>
                    <LabbelledInput value = {this.state.initialUserName} labelName ="UserName" inputType="text" updateInput={this.updateUserNameInput}/>
                    <LabbelledInput value = {this.state.initialPassword} labelName ="Password" inputType="password" updateInput={this.updatePasswordInput}/>
                    <LabbelledInput value = {this.state.initialConfirmPassword} labelName =" Confirm Password" inputType="password" updateInput={this.updateConfirmPasswordInput} enterPressed={this.enterPressed} />
                    <Button className="button-margin" inputType="button" onClick={this.register} buttonName="SUBMIT"/>
                </div>
            )

    }


}
export default SignUp