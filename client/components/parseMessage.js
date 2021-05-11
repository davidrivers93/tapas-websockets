const USER_MATCH = /\/user\W/g;
function parseMessage(msg) {
  if (msg.match(USER_MATCH)) {
    socket.emit('changeUser', input.value.replace('/user ', ''));
  } else {
    socket.emit('message', input.value);
  }
}
