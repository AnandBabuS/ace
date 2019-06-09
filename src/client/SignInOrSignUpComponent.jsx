import React from 'react'
import LabbelledInput from './components/common/LabbelledInput.jsx';
import Button from './components/common/Button.jsx';
class SignInOrSignUpComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            intialUserName : '',
            initialPassword : '',
            initialConfirmPassword : ''
        };
        this.register = this.register.bind(this);
        this.updateUserNameInput = this.updateUserNameInput.bind(this)
        this.updatePasswordInput = this.updatePasswordInput.bind(this)
        this.updateConfirmPasswordInput = this.updateConfirmPasswordInput.bind(this)

    }
    updateUserNameInput(event){
        this.setState({intialUserName : event.target.value})
    }
    updatePasswordInput(event){
        this.setState({intialPassword : event.target.value})
    }
    updateConfirmPasswordInput(event){
        this.setState({intialConfirmPassword : event.target.value})
    }
    register(event) {
        console.log("intialUserName" , this.state.intialUserName)
        console.log("intialpassword" , this.state.intialPassword)
        console.log("intialConfirmpassword" , this.state.intialConfirmPassword)
        
     }
     newUserClick(){
       this.props.newUserChange(true)
     }
        
    render(){
        const newUser = this.props.newUser;
        if(newUser){
            return(
                <div>
                    <LabbelledInput labelName ="UserName" inputType="text" updateInput={this.updateUserNameInput}/>
                    <LabbelledInput labelName ="Password" inputType="password" updateInput={this.updatePasswordInput}/>
                    <LabbelledInput labelName =" Confirm Password" inputType="password" updateInput={this.updateConfirmPasswordInput} />
                    <Button inputType="button" onClick={this.register} buttonName="SUBMIT"/>
                </div>
            )
        }
        else{
            return(
                <div>
                    <LabbelledInput labelName ="UserName" inputType="text" updateInput={this.updateUserNameInput}/>
                    <LabbelledInput labelName ="Password" inputType="password" updateInput={this.updatePasswordInput}/>
                    <Button inputType="button" onClick={this.register} buttonName="LOG IN"/>
                    <Button inputType="button" onClick={this.props.newUserClick} buttonName="NEW USER"/>
                </div>
            )
    
        }

    }


}
export default SignInOrSignUpComponent