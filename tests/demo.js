$(function() {
  const ipc = new browserTabIpc.BrowserTabIPC();

  ipc.message(function(e) {
    $('#history').append($('<li>').html(`<mark class="tertiary">Re:</mark> <span class="re">${e}</span>`));
  });

  ipc.connect().then(function(e) {
    $('#history').append($('<li>').html(`Connected: ${e.connected}`));
  });

  function sendMessage() {
    const value = $('#text').val();
    ipc.postMessage(value);
  }

  function rememberMyText() {
    const value = $('#text').val();
    $('#history').append($('<li>').html(`<mark class="secondary">Me:</mark> <span class="me">${value}</span>`));
  }

  function clear() {
    $('#text').val('');
  }

  function sendClick() {
    sendMessage();
    rememberMyText();
    clear();
  }

  $('#sendBtn').click(sendClick);
  $('#text').on('keypress', function(e) {
    if (e.which == 13) {
      sendClick();
    }
  });
});
