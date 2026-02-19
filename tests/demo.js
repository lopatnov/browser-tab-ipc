$(function () {
  function esc(s) {
    return $('<span>').text(String(s)).html();
  }

  function addMessage(type, html) {
    const $li = $('<li>').addClass('msg ' + type).html(html);
    $('#history').append($li);
    const el = document.getElementById('history');
    el.scrollTop = el.scrollHeight;
  }

  function addSystemMsg(text, isError) {
    addMessage('system' + (isError ? ' error' : ''),
      '<span class="msg-bubble">' + esc(text) + '</span>');
  }

  function addChatMsg(direction, label, text) {
    addMessage(direction,
      '<span class="msg-label">' + label + '</span>' +
      '<span class="msg-bubble">' + esc(text) + '</span>');
  }

  let ipc;

  function getTransportLabel(type) {
    const labels = {
      sharedWorkerTransport:    'SharedWorker',
      localStorageTransport:    'SessionStorage',
      broadcastChannelTransport:'BroadcastChannel',
      anyTransport:             'Auto',
    };
    return labels[type] || 'Unknown';
  }

  function connect(transportTypes) {
    const ipcUrl = document.getElementById('workerUrl').value;

    ipc = new browserTabIpc.BrowserTabIPC({ transportTypes });

    ipc.message(function (e) {
      console.log('Message:', e);
      addChatMsg('received', 'Other tab', String(e));
    });

    ipc.connected((state) => {
      console.log('Connected:', state);
    });

    ipc.connectionError((state) => {
      console.log('Connection Error:', state);
    });

    ipc.disconnected((state) => {
      console.log('Disconnected:', state);
      addSystemMsg('Disconnected');
    });

    ipc.connect({ sharedWorkerUri: ipcUrl })
      .then(function (state) {
        const transportName = state.type !== undefined && state.type !== null
          ? browserTabIpc.TransportType[state.type] || String(state.type)
          : getTransportLabel($('input[name=transport]:checked').val());
        $('#transport-badge').text(transportName);
        addSystemMsg('Connected · ' + transportName);
      })
      .catch(function (e) {
        console.error(e);
        addSystemMsg('Connection failed: ' + JSON.stringify(e), true);
      });
  }

  function getTransportType() {
    const option = $('input[name=transport]:checked', '#options').val();
    switch (option) {
      case 'sharedWorkerTransport':     return browserTabIpc.TransportType.sharedWorker;
      case 'localStorageTransport':     return browserTabIpc.TransportType.sessionStorage;
      case 'broadcastChannelTransport': return browserTabIpc.TransportType.broadcastChannel;
      default:                          return undefined;
    }
  }

  function showChat() {
    $('#connect-panel').addClass('d-none');
    $('#chat-panel').removeClass('d-none');
    $('#text').focus();
  }

  function hideChat() {
    $('#chat-panel').addClass('d-none');
    $('#connect-panel').removeClass('d-none');
    $('#history').empty();
  }

  function connectClick() {
    connect(getTransportType());
    showChat();
  }

  function disconnectClick() {
    ipc.disconnect();
    hideChat();
  }

  function sendClick() {
    const value = String($('#text').val()).trim();
    if (!value) return;
    ipc.postMessage(value);
    addChatMsg('sent', 'Me', value);
    $('#text').val('');
  }

  $('#connectBtn').on('click', connectClick);
  $('#disconnectBtn').on('click', disconnectClick);
  $('#sendBtn').on('click', sendClick);
  $('#text').on('keydown', function (e) {
    if (e.key === 'Enter') sendClick();
  });
});
