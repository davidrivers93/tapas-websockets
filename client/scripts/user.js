socket.on('users', function(msg) {
  var users = document.getElementById('users');
  users.innerHTML = '';

  msg.message.forEach(function(userConnected) {
    var container = document.createElement('div');
    container.classList = 'chatbox__user';

    var bullet = document.createElement('p');
    bullet.classList = 'chatbox__user--active--bullet ';
    container.appendChild(bullet);

    var user = document.createElement('p');
    user.textContent = userConnected;
    container.appendChild(user);

    users.appendChild(container);
  });
});
