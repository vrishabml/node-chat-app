const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

var users = new Users();

io.on('connection',(socket) => {
  console.log('new user connected');

  socket.on('join',(params, callback) => {
    if(!isRealString(params.Name) || !isRealString(params.Room))
    {
        return callback('Name and room name are required');
    }
    socket.join(params.Room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.Name, params.Room);

    io.to(paramas.Room).emit('updateUserList', users.getUserList(params.Room));
    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.to(params.Room).emit('newMessage', generateMessage('Admin',`${params.Name} has joined the room`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage',generateMessage(message.from,message.text));
    if(callback)
    callback();
});
  socket.on('createLocationMessage',(coords) => {
    io.emit('newLocation',generateLocationMessage('Admin',coords.latitude, coords.longitude))
  });
  socket.on('disconnect', (socket) => {
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.Room).emit('updateUserList', users.getUserList(user.Room));
      io.to(user.Room).emit('newMessage', generateMessage('Admin',`${user.name} has left`));
    }
  });
});



server.listen(port, () => {
  console.log(`Server is up at PORT ${port}`);
});
