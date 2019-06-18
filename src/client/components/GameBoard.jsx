import React from 'React'
import SocketUtils from "../socketUtils"
import card from "../assets/pcard3.png"
import CenterBoardPlayers from "./CenterBoardPlayers.jsx"
//import { threadId } from 'worker_threads';
//import Draggable, {DraggableCore} from 'react-draggable';

const shapeMap = {
    "H": "hearts",
    "S": "spades",
    "D": "diamonds",
    "C": "clubs"
}
const numberMap = {
    "A": "two",
    "B": "three",
    "C": "four",
    "D": "five",
    "E": "six",
    "F": "seven",
    "G": "eight",
    "H": "nine",
    "I": "ten",
    "J": "jack",
    "K": "queen",
    "L": "king",
    "M": "ace",
}

const Card = ({ cardValue , onCardClick, currentPlayer, cardShape, hasCardShape }) => {
    const cardIDArr = cardValue.split("");
    const shape = shapeMap[cardIDArr[0]];
    const number = numberMap[cardIDArr[1]]
    const className = "card " + number + "_" + shape;
    const onClick = (event) => {
        const { userName } = window.userData;
        console.log(currentPlayer !== userName || (cardShape && hasCardShape(shape) && cardShape !== shape))
        console.log(currentPlayer !== userName, currentPlayer, userName)
        console.log(cardShape + "--cardShape")
        console.log(hasCardShape(shape), shape)
        console.log("cardShape !== shape---", cardShape !== shape)
        if(currentPlayer !== userName || (cardShape && hasCardShape(cardShape) && cardShape !== shape)){
            return;
        }
        const socket = SocketUtils.getSocket();
        onCardClick(cardValue, userName, className);
        socket.emit("cardDrop", { room: SocketUtils.getRoom(), userName, card: cardValue });
    }
    return (
        <div onClick={onClick} cardValue={cardValue} className={className}></div>
    )
}

const Name = ({ hasWon, player ,index}) => {
    const className = "player" + "-" + (index+1);
    const classNamePlayer=  "player" + "-" + (index+1) + '-'+ "card";
    const wonMsg = `${player} has won`
    return (
    <div>
        <span className={classNamePlayer}>{player}</span>
    { hasWon ? wonMsg : <img className={className} src={card} alt="cards" height="200" width="200"></img> }
    </div>
    )
}

class GameBoard extends React.Component{

    constructor(props){
        super(props)
        const playerWithCardData = {}
        props.players.forEach((player) => { playerWithCardData[player] = '' })
        const players = props.players;
        const { userName } = window.userData;
        const otherPlayers = players.filter((player)=>player!==userName);
        this.state = {
            iWon: false,
            iLost: false,
            isWon: {},
            otherPlayers,
            cards: props.cards,
            playerWithCardData,
            currentPlayer: '',
            cardShape: '',
        }
        this.onCardClick = this.onCardClick.bind(this)
        this.hasCardShape = this.hasCardShape.bind(this)

    }
    onCardClick(card, userName, className){
        const cards = this.state.cards.filter((singleCard)=> singleCard !== card)
        const playerWithCardData = this.state.playerWithCardData
        playerWithCardData[userName] = className
        this.setState({ cards, playerWithCardData });
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps")
        const players = nextProps.players;
        const { userName } = window.userData;
        const otherPlayers = players.filter((player)=>player!==userName);
        this.setState({ cards: nextProps.cards, otherPlayers });
    }
    componentWillMount(){
        const { userName } = window.userData;
        const socket = SocketUtils.getSocket();
        socket.on("cardReceive", ({ userName, card }) => {
            console.log("cardReceive successfully", userName, card); 
            const cardIDArr = card.split("");
            const shape = shapeMap[cardIDArr[0]];
            const number = numberMap[cardIDArr[1]]
            const className = number + "_" + shape;
            const playerWithCardData = this.state.playerWithCardData
            playerWithCardData[userName] = className
           this.setState({
               playerWithCardData,
               cardShape: shape,
           })
        });

        socket.on("currentPlayer", ( data ) => {
            const { currentPlayer } = data
            this.setState({
              currentPlayer,
            })
        })

        socket.on("clearBoard", ( data ) => {
            const playerWithCardData = this.state.playerWithCardData
            let iWon = false;
            if( this.state.cards.length <= 0 ) {
                iWon = true;
            }
            for( const player in playerWithCardData) {
                playerWithCardData[player] = ''
            }
            if(iWon) {
                socket.emit("playerWon", { room: SocketUtils.getRoom(), userName });
            }
            this.setState({
                iWon,
                playerWithCardData,
                cardShape: '',
            })
        })

        socket.on("receiveCutCards", ( data ) => {
            let cards = this.state.cards
            cards = cards.concat(data.cutCards);
            this.setState({ cards })
        });

        socket.on("playerWon", ({ playerName }) => {
            const isWon = this.state.isWon
            isWon[playerName] = true;
            let iLost = false;
            const otherPlayersLength = this.state.otherPlayers.length;
            let noOfPlayersWon = Object.keys(isWon).length
            console.log(noOfPlayersWon, "noOfPlayersWon", otherPlayersLength, "otherPlayersLength")
            if(otherPlayersLength === noOfPlayersWon) {
                console.log("inside if lost")
                iLost = true
            }
            this.setState({ isWon, iLost })
        });
    }

    hasCardShape(cardShape) {
        const cards = this.state.cards
        console.log(cards)
        return cards.some((card) => {
            const cardIDArr = card.split("");
            const shape = shapeMap[cardIDArr[0]];
            console.log(card, cardShape, shape)
            return (cardShape === shape)
        })
    }


    render(){
        // const socket = SocketUtils.getSocket();
        // socket.on("cardReceive", ({ userName, card }) => {
        //     console.log("cardReceive successfully", userName, card);
        // });
        const { otherPlayers, isWon, iWon, iLost } = this.state
        const { players} = this.props
        console.log(iLost, "---lost from render")
        const otherNames = otherPlayers.length > 0 ? otherPlayers
            .map((player,index) => <Name hasWon={isWon[player]} player={player} index={index}/>) : null

        const cards = (this.state.cards && this.state.cards.length) > 0
            ? this.state.cards.map((cardValue) => <Card hasCardShape={this.hasCardShape} cardShape={this.state.cardShape} currentPlayer={this.state.currentPlayer} cardValue={cardValue} onCardClick={this.onCardClick} />) : null
        return (
            <div>
                <div >{otherNames}</div>
                <CenterBoardPlayers isWon={isWon} playerWithCardData={this.state.playerWithCardData} players={players}/>
                <div className="card-bottom">
                    {iLost ? "You lost" : iWon ? "You won dude" : cards}
                </div>
            </div>
        )
    }
}
export default GameBoard