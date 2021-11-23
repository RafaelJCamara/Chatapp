const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const botName = 'ChatCord bot'

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects [all the steps inside, except disconnect, are executed during a connection]
io.on('connection', socket => {

    //someone joined the room
    socket.on('joinRoom', ({ username, room }) => {
        //create a new user
        const user = userJoin(socket.id, username, room);
        //make user join room
        socket.join(user.room);

        //sending welcome message to the client that is logging in
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
        //broadcast to everyone when a user connects [sends to everyone except self]
        //broadcast to the specific room that this user has joined
        socket.broadcast.to(user.room).emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat.`)
        );

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    //listen for chat message
    socket.on('chatMessage', (msg) => {
        //get current user
        const user = getCurrentUser(socket.id);

        //emit to everyone (including self)
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //broadcast to everyone when a user disconnects
    socket.on('disconnect', () => {
        //get disconnected user
        const user = userLeave(socket.id);
        if (user) {
            //let everyone know
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat.`));
        }
        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});