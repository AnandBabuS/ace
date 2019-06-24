import React from 'react'
class CenterBoardPlayers extends React.Component{
    render(){
        const createDivElement = this.props.players.map((player,index)=>{
            const hasPlayerWon = this.props.isWon[player];
            const isCurrentPlayer = this.props.currentPlayer === player
            let className = (isCurrentPlayer ? "current-player-border" : "")
            className = className + " center-card "
            className = className + this.props.playerWithCardData[player]
            if(hasPlayerWon) {
                return null;
            }
            return <div className={className}>{player}</div>
        })
        return(
            <div className="centerBoard">
                {createDivElement}
            </div>
        )
    }

}
export default CenterBoardPlayers