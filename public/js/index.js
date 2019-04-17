var socket = io();
socket.on('connect', function() {
  console.log('Connected to server');
  socket.emit('createMessage', {
    toAddress:'vrishab@facebook.com',
    text:'How you doing?'
  })
});
socket.on('newMessage',function(message) {
  console.log('New Message received', message);
});
socket.on('disconnect', function()  {
  console.log('Disconnected from server');
});
