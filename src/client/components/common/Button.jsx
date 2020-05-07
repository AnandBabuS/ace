import React from  'react';
class Button extends React.Component{
    render(){
        const { className } = this.props
        return(
            <div className={className}>
                <button className="btn btn-green" onClick={this.props.onClick}> {this.props.buttonName}  </button>
            </div>
        )
    }
} 
export default Button