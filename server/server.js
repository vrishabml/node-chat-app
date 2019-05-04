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

    io.to(params.Room).emit('updateUserList', users.getUserList(params.Room));
    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.to(params.Room).emit('newMessage', generateMessage('Admin',`${params.Name} has joined the room`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
        io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
    }

    if(callback)
    callback();
});
  socket.on('createLocationMessage',(coords) => {
    var user = users.getUser(socket.id);
    if(user){
    io.to(user.room).emit('newLocation',generateLocationMessage(user.name,coords.latitude, coords.longitude));
  }
  });
  socket.on('disconnect', () => {
    console.log(socket.id);
    var user = users.removeUser(socket.id);
    console.log(user);
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left`));
      console.log('Disconnected user');
    }
  });
});



server.listen(port, () => {
  console.log(`Server is up at PORT ${port}`);
});
