import React from  'react';
class Button extends React.Component{
    render(){
        let buttonClassName = 'btn-wrapper'
        const { className } = this.props
        if(className) {
            buttonClassName = buttonClassName + " " + className
        }
        return(
            <div className={buttonClassName}>
                <button className="btn btn-green" onClick={this.props.onClick}> {this.props.buttonName}  </button>
            </div>
        )
    }
} 
export default Button