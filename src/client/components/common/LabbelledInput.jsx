import React from 'react';
class LabbelledInput extends React.Component{
    render(){
        var textAlignment = {
            margin: '10px'
        }
        return(
            <div className="input-wrapper">
                <input placeholder={this.props.labelName} value={this.props.value} style = {textAlignment} onChange={this.props.updateInput} onKeyPress={this.props.enterPressed} type={this.props.inputType}></input>
            </div>
        )
    }
}
export default LabbelledInput