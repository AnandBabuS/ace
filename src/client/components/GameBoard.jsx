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

const Name = ({ player ,index}) => {
    const className = "player" + "-" + (index+1);
    const classNamePlayer=  "player" + "-" + (index+1) + '-'+ "card";
    return (
    <div >
        <span className={classNamePlayer}>{player}</span><img className={className} src={card} alt="cards" height="200" width="200"></img>
    </div>
    )
}

class GameBoard extends React.Component{

    constructor(props){
        super(props)
        const playerWithCardData = {}
        props.players.forEach((player) => { playerWithCardData[player] = '' })
        this.state = {
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
        this.setState({ cards: nextProps.cards });
    }
    componentWillMount(){
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
            for( const player in playerWithCardData) {
                playerWithCardData[player] = ''
            }
            this.setState({
                playerWithCardData,
                cardShape: '',
            })
        })

        socket.on("receiveCutCards", ( data ) => {
            let cards = this.state.cards
            cards = cards.concat(data.cutCards);
            this.setState({ cards })
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
        const players = this.props.players;
        const { userName } = window.userData;
        const otherPlayers = players.filter((player)=>player!==userName);
        const otherNames = otherPlayers.length > 0 ? otherPlayers
            .map((player,index) => <Name player={player} index={index}/>) : null

        const cards = (this.state.cards && this.state.cards.length) > 0
            ? this.state.cards.map((cardValue) => <Card hasCardShape={this.hasCardShape} cardShape={this.state.cardShape} currentPlayer={this.state.currentPlayer} cardValue={cardValue} onCardClick={this.onCardClick} />) : null
        return (
            <div>
                <div >{otherNames}</div>
                <CenterBoardPlayers playerWithCardData={this.state.playerWithCardData} players={players}/>
                <div className="card-bottom">
                    {cards}
                </div>
            </div>
        )
    }
}
export default GameBoard