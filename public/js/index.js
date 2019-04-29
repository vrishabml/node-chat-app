var socket = io();
socket.on('connect', function() {
  console.log('Connected to server');

});
socket.on('newMessage',function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocation', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${message.from}: ${formattedTime}`);
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

socket.on('disconnect', function()  {
  console.log('Disconnected from server');
});

jQuery('#message-form').on('submit',function(e) {
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from:'User',
    text:messageTextbox.val()
  }, function() {
    messageTextbox.val('');
  });
});

var locationSelector = jQuery('#send-location');
locationSelector.on('click', function() {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }
  locationSelector.attr('disabled','disabled').text('Sending Location...');
  navigator.geolocation.getCurrentPosition(function(position) {
    locationSelector.removeAttr('disabled','disabled').text('Send Location');
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    })
  }, function() {
    locationSelector.removeAttr('disabled').text('Send Loacation');
    alert('Unable to fetch a location');
  },  {timeout: 10000})
});
