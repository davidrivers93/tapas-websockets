const input = document.getElementById('input');

input.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (input.value) {
      parseMessage(input.value);
      input.value = '';
    }
  }
});
