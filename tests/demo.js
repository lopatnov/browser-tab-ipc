$(function () {
  let ipc;

  function connect(transportTypes) {
    const ipcUrl = document.getElementById('workerUrl').value;

    ipc = new browserTabIpc.BrowserTabIPC({
      transportTypes: transportTypes,
    });

    ipc.message(function (e) {
      console.log('Message:', e);
      $('#history').append($('<li>').html(`<mark class="tertiary">Re:</mark> <span class="re">${e}</span>`));
    });

    ipc.connected((state) => {
      console.log('Connected:', state);
    });

    ipc.connectionError((state) => {
      console.log('Connection Error:', state);
    });

    ipc.disconnected((state) => {
      console.log('Disconnected:', state);
      $('#history').append($('<li>').html(`Disconnected`));
    });

    ipc
      .connect({
        sharedWorkerUri: ipcUrl,
      })
      .then(function (e) {
        $('#history').append($('<li>').html(`Connected: ${e.connected}`));
      })
      .catch(function (e) {
        console.error(e);
        $('#history').append($('<li>').html(`<pre>Connection Error: \n${JSON.stringify(e).replace(/\\n/g, '\n')}</pre>`));
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

  function hideChat() {
    $('.options.row').show();
    $('.browser-chat').addClass('hidden');
  }

  function connectClick() {
    const transportType = getTransportType();
    connect(transportType);
    showChat();
  }

  function disconnectClick() {
    ipc.disconnect();
    hideChat();
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
  $('#disconnectBtn').click(disconnectClick);
  $('#sendBtn').click(sendClick);
  $('#text').on('keypress', function (e) {
    if (e.which == 13) {
      sendClick();
    }
  });
});
