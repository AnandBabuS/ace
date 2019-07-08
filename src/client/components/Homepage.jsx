import React , { Component } from 'react';
import Button from './common/Button.jsx';
import Modal from 'react-modal';
import axios from 'axios';
import Users from "./Users.jsx";
import SocketUtils from "../socketUtils" 
import GameBoard from "./GameBoard.jsx"

require("../homepage.css")
class Homepage extends Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            users: [],
            selectedUser : [],
            showGameBoard : false,
            cards: [],
            players: []
        };
        this.room = null;
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.fetchActiveUsers = this.fetchActiveUsers.bind(this)
        this.onInvite = this.onInvite.bind(this)
        this.checkUser = this.checkUser.bind(this)
    }

    componentWillMount() {
        const me = this
        const { userName } = window.userData
        SocketUtils.connectSocket()
        const socket = SocketUtils.getSocket();
        socket.emit(
            "hi",
            {
              name: userName
            },
            () => {
              console.log("data sent from client");
            }
          );
          
          socket.on("invitePpl", function(data) {
            console.log(" invite received from " + data.invitee);
            const result = window.confirm(
                " want to accept the invite to join game from " + data.invitee
              );
              if (result) {
                console.log(data.room);
                me.room = data.room;
                console.log('setting room',data.room)
                SocketUtils.setRoom(data.room);
                socket.emit("accept", { invite: userName, invitee: data.invitee });
                console.log("accept")
                me.setState({showGameBoard : true})
              } else {
                socket.emit("reject", { invite: userName, invitee: data.invitee });
              }
          });

          socket.on("initialCards", function(data){
              console.log(data.cards)
              SocketUtils.setRoom(data.room);
              me.setState({
                  cards: data.cards,
                  players: data.players,
                  showGameBoard:true
              })
          });
    }

    onOpenModal(){
        this.setState({ open: true });
    }

    onCloseModal(){
        this.setState({ open: false });
    }

    fetchActiveUsers(){
        const me = this;
        axios.get("./getUsers")
        .then(function(response) {
            console.log(response.data)
            me.setState({
                users: response.data
            })
        })
        .catch(function(error) {
          console.log(error);
        })
    }
    onInvite(){
        const socket = SocketUtils.getSocket();
        const { userName } = window.userData
        socket.emit("invitePpl", { invitedPpl: this.state.selectedUser, invitee: userName }, () => {
            console.log("invited successfully");
          });
    }

    checkUser(user){
        let selectedUser = this.state.selectedUser
        selectedUser.push(user)
        this.setState({
            selectedUser
        })
    }
    render(){
        const { userName } = window.userData
        const { open, users } = this.state;
        return(
            <div>
                <div className="header-comp">
                    Logged as {userName}
                    <a href="/logout">logout</a>
                </div>  
                {!this.state.showGameBoard?
                (<div>
                    <Modal
                        isOpen={open}
                        onAfterOpen={this.fetchActiveUsers}
                        contentLabel="Example Modal"
                        className="Modal"
                        overlayClassName="Overlay"
                        ariaHideApp={false}
                        >
                        <Users checkUser={this.checkUser} users={users}/>
                        <Button className="modal-button" onClick={this.onCloseModal} buttonName="Close"></Button>
                        <Button className="modal-button" onClick={this.onInvite} buttonName="Invite"></Button>
                    </Modal>
                    <div className="text-align"> <Button className="btns-wrapper" inputType="button" onClick={this.onOpenModal} buttonName="Create Game"/> </div>
                  
                </div>) : <GameBoard players= {this.state.players} cards={ this.state.cards }/>}
                
            </div>
        )
    
    }
}
export default Homepage
