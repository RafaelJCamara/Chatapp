const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects [all the steps inside, except disconnect, are executed during a connection]
io.on('connection', socket => {

    //sending welcome message to the client that is logging in
    socket.emit('message', 'Welcome to ChatCord!');

    //broadcast to everyone when a user connects [sends to everyone except self]
    socket.broadcast.emit('message', 'A user has joined the chat.');

    //broadcast to everyone when a user disconnects
    socket.on('disconnect', () => {
        //let everyone know
        io.emit('message', 'A user has left the chat.');
    });

    //listen for chat message
    socket.on('chatMessage', (msg) => {
        //emit to everyone
        io.emit('message', msg);
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});