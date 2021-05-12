const USER_MATCH = /\/user\W/g;
const PRICE_MATCH = /\/price\W/g;
const HELP_MATCH = /\/help/g;
const COMMAND_MATCH = /(\/\w+) ([a-zA-Z]+)/g;

function parseMessage(msg) {
  if (msg.match(USER_MATCH)) {
    return socket.emit('changeUser', input.value.replace('/user ', ''));
  } else if (msg.match(PRICE_MATCH)) {
    return socket.emit('getPrice', input.value.replace('/price ', ''));
  } else if (msg.match(HELP_MATCH)) {
    return placeChatMessage({
      message:
        'Type /user to change your user name or /price and the symbol you would like to know the current price',
      name: 'Admin',
      date: new Date(),
    });
  } else if (msg.match(COMMAND_MATCH)) {
    return placeNotification('You have entered an incorrect command');
  } else {
    return socket.emit('message', input.value);
  }
}
