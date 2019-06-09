import React , { Component } from 'react';
import LoginForm from './components/LoginForm.jsx'
require("./login.css")
class App extends Component {

    constructor(props){
        super(props);
    }
    render(){
         
        return(
           <LoginForm />
        )
    
    }
}
export default App
