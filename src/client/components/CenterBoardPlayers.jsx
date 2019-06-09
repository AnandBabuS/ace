import React from 'react'
class CenterBoardPlayers extends React.Component{
    render(){
        const createDivElement = this.props.players.map((player,index)=>{
            return <div className={"center-card " + this.props.playerWithCardData[player]}>{player}</div>
        })
        return(
            <div className="centerBoard">
                {createDivElement}
            </div>
        )
    }

}
export default CenterBoardPlayers