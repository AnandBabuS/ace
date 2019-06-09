import React from 'react';
class LabbelledInput extends React.Component{
    render(){
        var labelAlignment={
            textAlign:'right',
            display:'inline-block',
            width:'140px'
        }
        var textAlignment={
            margin: '5px'
        }
        var divAlign ={
            marginTop:'10px'
        }
        return(
            <div style={divAlign}>
                <label style ={labelAlignment} htmlFor={this.props.labelName}>{this.props.labelName}</label>
               <input value={this.props.value} style = {textAlignment} onChange={this.props.updateInput} onKeyPress={this.props.enterPressed} type={this.props.inputType}></input>
            </div>
        )
    }
}
export default LabbelledInput