var socket = io();

function scrollToBottom() {
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if(err) {
      alert(err);
      window.location.href ='/';
    }
    else {
      console.log('No errors');
    }
  });
});
socket.on('newMessage',function(message) {
  var template = jQuery('#message-template').html();
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt:formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocation', function (message) {
  var template  = jQuery('#location-message-template').html();
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt:formattedTime
  })
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>');
  // li.text(`${message.from}: ${formattedTime}`);
  // a.attr('href',message.url);
  // li.append(a);
   jQuery('#messages').append(html);
   scrollToBottom();
});

socket.on('disconnect', function()  {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);  
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
