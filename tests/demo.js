$(function () {
  let ipc;

  function connect(transportTypes) {
    ipc = new browserTabIpc.BrowserTabIPC({
      transportTypes: transportTypes,
    });

    ipc.message(function (e) {
      $('#history').append($('<li>').html(`<mark class="tertiary">Re:</mark> <span class="re">${e}</span>`));
    });

    ipc
      .connect()
      .then(function (e) {
        $('#history').append($('<li>').html(`Connected: ${e.connected}`));
      })
      .catch(function (e) {
        console.error(e);
        $('#history').append($('<li>').html(`Connection Error: ${JSON.stringify(e)}`));
      });
  }

  function getTransportType() {
    const option = $('input[name=transport]:checked', '#options').val();
    switch (option) {
      case 'sharedWorkerTransport':
        return browserTabIpc.TransportType.sharedWorker;
      case 'localStorageTransport':
        return browserTabIpc.TransportType.sessionStorage;
      default:
        return undefined;
    }
  }

  function showChat() {
    $('.options.row').hide();
    $('.hidden.browser-chat').removeClass('hidden');
  }

  function connectClick() {
    const transportType = getTransportType();
    connect(transportType);
    showChat();
  }

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

  $('#connectBtn').click(connectClick);
  $('#sendBtn').click(sendClick);
  $('#text').on('keypress', function (e) {
    if (e.which == 13) {
      sendClick();
    }
  });
});
