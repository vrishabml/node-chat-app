const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('new user connected');

  socket.emit('newMessage', {
    from:'Admin',
    text:'Welcome to the chat app'
  });

  socket.broadcast.emit('newMessage', {
    from:'Admin',
    text:'Welcome to the chat app',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage',{
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
});
  //   socket.broadcast.emit('newMessage', {
  //     from: message.from,
  //     text: message.text,
  //      createdAt: new Date().getTime()})
  // });
  socket.on('disconnect', (socket) => {
    console.log('Client Disconnected');
  });
});



server.listen(port, () => {
  console.log(`Server is up at PORT ${port}`);
});
