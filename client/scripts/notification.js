function placeNotification(message) {
  const notifications = document.getElementById('notifications');

  var notification = document.createElement('div');
  notification.innerHTML = message;
  notification.classList = 'notification__danger';

  notifications.appendChild(notification);

  setTimeout(() => notifications.removeChild(notification), 5000);
}
