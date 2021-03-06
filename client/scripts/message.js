const socket = io('');

socket.on('connect', function() {
  console.log('Connected');
});

socket.on('message', function(msg) {
  if (msg.isPrivate) {
    placeNotification(msg.message);
  } else {
    placeChatMessage(msg);
  }
});

function placeChatMessage(msg) {
  var container = document.createElement('div');
  container.classList = 'chatbox__messages__user-message';

  var div = document.createElement('div');
  div.classList = 'chatbox__messages__user-message--ind-message';

  var message = document.createElement('p');
  message.textContent = msg.message;
  message.classList = 'message';

  var user = document.createElement('p');
  user.textContent = msg.name;
  user.classList = 'name';

  var date = document.createElement('p');
  date.textContent = moment(msg.date).format('YYYY-MM-DD HH:mm:ss');
  date.classList = 'date';

  div.appendChild(user);
  div.appendChild(date);
  div.appendChild(message);

  container.appendChild(div);

  messages.appendChild(container);

  messages.scrollTo(0, messages.scrollHeight);
}
