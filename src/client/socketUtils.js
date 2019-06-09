import io from 'socket.io-client';
 
let socket = null;
let room = null;

const getSocket = () => {
    return socket;
}

const connectSocket = () => {
    socket = io('http://localhost:8080')
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