import io from 'socket.io-client';
 
let socket = null;
let room = null;

const getSocket = () => {
    return socket;
}

const connectSocket = () => {
    socket = io('https://ace-hears.firebaseapp.com')
}

const setRoom = (roomId) => {
    room = roomId
}

const getRoom = () => {
    return room;
}

export default {
    getSocket,
    connectSocket,
    setRoom,
    getRoom
}