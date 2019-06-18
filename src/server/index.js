const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const { signInRoute, signUpRoute } = require("./routes/LoginRoute");
const mongoose = require("mongoose");
const session = require("express-session");
//const FileStore = require("session-file-store")(session);
const path = require("path")

var app = express();
app.use(
  session({
    name: "_es_demo", // The name of the cookie
    secret: "1234", // The secret is required, and is used for signing cookies
    resave: false, // Force save of session for each request.
    saveUninitialized: true, // Save a session that is new, but has not been modified
    cookie: {
      maxAge: 1000 * 60 * 5
    }
  })
);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.get('/', function(req, res) {
  if(req.sessionID && req.session.user) {
    res.render('homepage', { userName: req.session.user });
  } else {
    res.render('login', { title: 'Express' });
  }
});

app.get("/home", function(req, res) {
  console.log(req.sessionID)
  console.log(req.session)
  if(req.sessionID && req.session.user) {
    res.render('homepage', { userName: req.session.user });
  } else {
    res.render('login', { title: 'Express' });
 }
})

app.use(express.static("public"));

// parse application/json
app.use(bodyParser.json());
var sockets = {};

app.post("/signin", signInRoute);
app.post("/signup", signUpRoute);

app.get("/getUsers", (req, res) => {
  const allUsers = Object.keys(sockets);
  const allUsersButMe = allUsers.filter((user) => user !== req.session.user)
  console.log(allUsersButMe);
  res.send(allUsersButMe);
});

const userName = "anandbabu";
const password = "password123";

var mongoLink =
  "mongodb://" +
  userName +
  ":" +
  password +
  "@ds133127.mlab.com:33127/asoft-db";

mongoose.connect(mongoLink);
mongoose.Promise = global.Promise;

var server = app.listen(8080, () => {
  console.log("listens to 8080");
});

var io = socket(server);

const rooms = {};
let roomNo = 0;

const getRandomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

const getOnePlateCards = (cardFace) => {
  const cards = []
  for( i = 76 ; i < 78 ; i++ ){ //for( i = 65 ; i < 78 ; i++ ){
    cards.push(cardFace + String.fromCharCode(i));
  }
  return cards;
}

const getCards = () => {
  return getOnePlateCards("H").concat(getOnePlateCards("S")).concat(getOnePlateCards("C")).concat(getOnePlateCards("D"))
}

const containAce = (cards) => {
  return (cards.indexOf("SM") > -1)
}

const emitCurrentPlayerData = (room) => {
  const { currentPlayer } = room
  io.in(room.roomId).emit('currentPlayer', { currentPlayer });
}

const emitCards = (room) => {
  room.currentPlayer = null;
  for( player in room.players){
    const socketId = sockets[player];
    if(containAce(room.players[player].cards)) {
      room.currentPlayer = player;
    }
    io.to(`${socketId}`).emit("initialCards", { room: room.roomId, players: Object.keys(room.players), cards: room.players[player].cards });
  }
}

const getRoomFromRoomId = (roomId) => {
  for(const inviteeName in rooms) {
    const room = rooms[inviteeName]
    if(room.roomId === roomId) {
      return room
    }
  }
  return null;
}

const createGame = (room) => {
  let iterator = 0
  const numberOfPlayers = Object.keys(room.players).length
  const cards = getCards()
  while (cards.length > 0) {
    const randomInt = getRandomInt(cards.length)
    const splicedCards = cards.splice(randomInt, 1);
    const card = splicedCards[0];
    const players = Object.keys(room.players);
    const currentPlayer = players[(iterator % (numberOfPlayers))];
    if(!room.players[currentPlayer].cards) {
      room.players[currentPlayer].cards = []
    }
    room.players[currentPlayer].cards.push(card)
    iterator++;
  }
  emitCards(room)
  emitCurrentPlayerData(room);
}

const checkForCardCut = (room) => {
  const { currentRoundPlayerAndCard } = room
  console.log(currentRoundPlayerAndCard)
  let i = 0;
  const initialPlayerAndcard = currentRoundPlayerAndCard[i];
  const initialCard = initialPlayerAndcard && initialPlayerAndcard.card;
  const initialCardShape = initialCard && initialCard.split("")[0]
  i++;
  while(currentRoundPlayerAndCard[i]) {
    const nextCardShape = currentRoundPlayerAndCard[i].card.split("")[0]
    if( nextCardShape !== initialCardShape) {
      return true;
    }
    i++;
  }
  return false;
}

const isEligibleForCollect = (room) => {
  console.log("isEligibleForCollect")
  const { acceptedplayers, currentRoundCardsCount } = room
  const isCardCut = checkForCardCut(room);
  console.log(currentRoundCardsCount)
  if(currentRoundCardsCount === ( acceptedplayers + 1)) {
    console.log("isEligibleForCollect", true, "-- number")
    return true;
  } else if(isCardCut) {
    console.log("isEligibleForCollect", true, "--card cut")
    return true;
  }
  console.log("isEligibleForCollect", false)
  return false
}

const removePlayersWon = (roomObj) => {
  const { playersWons, players } = roomObj;
  
}

const findNextUserToPlay = (room) => {
  console.log("findNextUserToPlay")
  const { currentPlayer, playersWons } = room
  const players = Object.keys(room.players)
  const eligiblePlayers = players.filter((player) => (playersWons.indexOf(player) === -1))
  let index = eligiblePlayers.indexOf(currentPlayer);
  let nextIndex = index + 1;
  if(eligiblePlayers[nextIndex]){
    return eligiblePlayers[nextIndex];
  }
  return eligiblePlayers[0];
}

const findFirstPlayerForNextRound = (room) => {
  console.log("findFirstPlayerForNextRound")
  let i = 0 ;
  const { currentRoundPlayerAndCard } = room
  const firstPlayerAndCard = currentRoundPlayerAndCard[0]
  let nextPotentialstarter = firstPlayerAndCard.player
  let nextPotentialStaterCard = firstPlayerAndCard.card
  const firstPlayerCardShape = firstPlayerAndCard.card.split("")[0]
  console.log(firstPlayerAndCard)
  i++;
  while(currentRoundPlayerAndCard[i]) {
    const nextPlayerCard = currentRoundPlayerAndCard[i].card.split("")[0]
    console.log(currentRoundPlayerAndCard[i].card , "-- current loop card ", nextPotentialStaterCard, " -- nextPotentialStaterCard")
    console.log(currentRoundPlayerAndCard[i].card > nextPotentialStaterCard)
    if(nextPlayerCard !== firstPlayerCardShape) {
      console.log("got cut the next round first player is -- ", nextPotentialstarter)
      const socketId = sockets[nextPotentialstarter];
      const cutCards = []
      currentRoundPlayerAndCard.forEach((playerAndCard) => {
        cutCards.push(playerAndCard.card);
      })
      io.to(`${socketId}`).emit("receiveCutCards", { cutCards });
      room.currentPlayer = nextPotentialstarter
      return;
    } else if(currentRoundPlayerAndCard[i].card > nextPotentialStaterCard) {
      nextPotentialStaterCard = currentRoundPlayerAndCard[i].card
      nextPotentialstarter = currentRoundPlayerAndCard[i].player
    }
    i++;
  }
  room.currentPlayer = nextPotentialstarter
  console.log("findFirstPlayerForNextRound", room.currentPlayer)
}

io.on("connection", socket => {
  socket.on("hi", function(data) {
    console.log(data.name);
    sockets[data.name] = socket.id;
    console.log(socket.id);
  });
  //  console.log("made connection", socket);
  socket.on("chatInRoom", function(data) {
    console.log(data);
    socket.to(data.room).emit("chatInRoom", data.message);
    //io.sockets.emit("chatInRoom", data);
  });

  socket.on("cardDrop", function({ room, userName, card}){
    console.log("cardDrop", room, userName, card)
    socket.to(room).emit("cardReceive", { userName, card });
    
    const roomObj = getRoomFromRoomId(room);
    roomObj.currentRoundPlayerAndCard.push({ player: userName, card })
    roomObj.currentRoundCardsCount++;
    if(isEligibleForCollect(roomObj)) {
      findFirstPlayerForNextRound(roomObj);
      console.log(roomObj.currentPlayer)
      io.in(roomObj.roomId).emit('clearBoard', "");
      emitCurrentPlayerData(roomObj);
      roomObj.currentRoundCardsCount = 0;
      roomObj.currentRoundPlayerAndCard = []
    } else{
      const nextUserToPlay = findNextUserToPlay(roomObj);
      roomObj.currentPlayer = nextUserToPlay;
      emitCurrentPlayerData(roomObj);
    }
  })

  socket.on("playerWon", function({ room, userName}){
    socket.to(room).emit("playerWon", { playerName: userName });
    const roomObj = getRoomFromRoomId(room);
    roomObj.playersWons.push(userName)
    removePlayersWon(roomObj);
    roomObj.acceptedplayers--;
  })

  socket.on("invitePpl", function(data) {
    console.log("server", JSON.stringify(data));
    const roomId = "room-" + roomNo;
    roomNo++;
    socket.join(roomId);
    rooms[data.invitee] = { roomId };
    rooms[data.invitee].invitedPpl = data.invitedPpl;
    rooms[data.invitee].noOfPplInvited = data.invitedPpl.length
    rooms[data.invitee].players = {
      [data.invitee]: {}
    }
    rooms[data.invitee].currentRoundCardsCount = 0;
    rooms[data.invitee].currentRoundPlayerAndCard = [];
    rooms[data.invitee].playersWons = []
    console.log(" i;nviting these ppl " + data.invitedPpl.toString())
    data.invitedPpl.forEach(person => {
      const socketId = sockets[person];
      io.to(`${socketId}`).emit("invitePpl", { invitee: data.invitee, room: roomId });
    });
  });

  socket.on("accept", function(data) {
    rooms[data.invitee].acceptedplayers = rooms[data.invitee].acceptedplayers ? rooms[data.invitee].acceptedplayers + 1 : 1
    console.log(data.invite + "accepting", data.invitee);
    socket.join(rooms[data.invitee].roomId);
    rooms[data.invitee].players[data.invite] = {}
    if( rooms[data.invitee].acceptedplayers === rooms[data.invitee].noOfPplInvited ) {
      console.log("all accepted")
      createGame(rooms[data.invitee]);
    }
  });
});

console.log("end of file");
