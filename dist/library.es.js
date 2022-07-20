var EventConnected = 'connected';
var EventConnectionError = 'connectionError';
var EventDisconnected = 'disconnected';
var EventMessage = 'message';
var DefaultSessionStorageKeyPrefix = 'ipc';

var TransportType;
(function (TransportType) {
    TransportType[TransportType["sessionStorage"] = 0] = "sessionStorage";
    TransportType[TransportType["sharedWorker"] = 1] = "sharedWorker";
})(TransportType || (TransportType = {}));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

// Copyright Joyent, Inc. and other Node contributors.

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
var events = EventEmitter;
var once_1 = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
events.once = once_1;

var SharedWorkerTransport = /** @class */ (function (_super) {
    __extends(SharedWorkerTransport, _super);
    function SharedWorkerTransport() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SharedWorkerTransport.isSupported = function () {
        return !!window.SharedWorker;
    };
    SharedWorkerTransport.prototype.onConnected = function (state) {
        this.emit(EventConnected, state);
    };
    SharedWorkerTransport.prototype.onConnectionError = function (state) {
        this.emit(EventConnectionError, state);
    };
    SharedWorkerTransport.prototype.onDisconnected = function (state) {
        this.emit(EventDisconnected, state);
    };
    SharedWorkerTransport.prototype.onMessage = function (state) {
        this.emit(EventMessage, state);
    };
    SharedWorkerTransport.prototype.connected = function (callback) {
        this.on(EventConnected, callback);
    };
    SharedWorkerTransport.prototype.connectionError = function (callback) {
        this.on(EventConnectionError, callback);
    };
    SharedWorkerTransport.prototype.disconnected = function (callback) {
        this.on(EventDisconnected, callback);
    };
    SharedWorkerTransport.prototype.message = function (callback) {
        this.on(EventMessage, callback);
    };
    SharedWorkerTransport.prototype.connect = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    this.worker = this.createWorker(options);
                    state = this.getConnectionState();
                    if (state.connected) {
                        addEventListener('beforeunload', function () { return _this.disconnect(); });
                        this.onConnected(state);
                        return [2 /*return*/, state];
                    }
                }
                catch (ex) {
                    state = this.getConnectionState();
                    state.error = ex;
                    this.onConnectionError(state);
                }
                throw state;
            });
        });
    };
    SharedWorkerTransport.prototype.getConnectionState = function () {
        var _a;
        return {
            connected: !!((_a = this.worker) === null || _a === void 0 ? void 0 : _a.port),
        };
    };
    SharedWorkerTransport.prototype.createWorker = function (options) {
        var _this = this;
        var worker = this.buildWorker((options === null || options === void 0 ? void 0 : options.sharedWorkerUri) || BrowserTabIPC.defaultWorkerUri);
        worker.port.onmessage = function (ev) {
            _this.onMessage(ev.data.message);
        };
        worker.port.start();
        return worker;
    };
    SharedWorkerTransport.prototype.buildWorker = function (workerUrl) {
        var worker;
        try {
            worker = new SharedWorker(workerUrl);
        }
        catch (e) {
            var blob = void 0;
            try {
                blob = new Blob(["importScripts('" + workerUrl + "');"], { type: 'application/javascript' });
            }
            catch (e1) {
                var blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
                blobBuilder.append("importScripts('" + workerUrl + "');");
                blob = blobBuilder.getBlob('application/javascript');
            }
            var url = window.URL || window.webkitURL;
            var blobUrl = url.createObjectURL(blob);
            worker = new SharedWorker(blobUrl);
        }
        return worker;
    };
    SharedWorkerTransport.prototype.disconnect = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_b) {
                if (this.worker) {
                    try {
                        this.worker.port.postMessage({
                            cmd: 'x',
                        });
                    }
                    finally {
                        (_a = this.worker) === null || _a === void 0 ? void 0 : _a.port.close();
                        this.worker = undefined;
                    }
                }
                state = this.getConnectionState();
                this.onDisconnected(state);
                return [2 /*return*/, state];
            });
        });
    };
    SharedWorkerTransport.prototype.postMessage = function (message) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                (_a = this.worker) === null || _a === void 0 ? void 0 : _a.port.postMessage({
                    cmd: 'm',
                    message: message,
                });
                return [2 /*return*/];
            });
        });
    };
    return SharedWorkerTransport;
}(events));

var SessionStorageTransport = /** @class */ (function (_super) {
    __extends(SessionStorageTransport, _super);
    function SessionStorageTransport() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nativeStorageEvent = null;
        _this.clientId = 0;
        _this.keyPrefix = DefaultSessionStorageKeyPrefix;
        _this.isConnected = false;
        return _this;
    }
    SessionStorageTransport.isSupported = function () {
        return !!localStorage;
    };
    SessionStorageTransport.prototype.onConnected = function (state) {
        this.emit(EventConnected, state);
    };
    SessionStorageTransport.prototype.onConnectionError = function (state) {
        this.emit(EventConnectionError, state);
    };
    SessionStorageTransport.prototype.onDisconnected = function (state) {
        this.emit(EventDisconnected, state);
    };
    SessionStorageTransport.prototype.onMessage = function (state) {
        this.emit(EventMessage, state);
    };
    SessionStorageTransport.prototype.connected = function (callback) {
        this.on(EventConnected, callback);
    };
    SessionStorageTransport.prototype.connectionError = function (callback) {
        this.on(EventConnectionError, callback);
    };
    SessionStorageTransport.prototype.disconnected = function (callback) {
        this.on(EventDisconnected, callback);
    };
    SessionStorageTransport.prototype.message = function (callback) {
        this.on(EventMessage, callback);
    };
    SessionStorageTransport.prototype.connect = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var clients, state;
            return __generator(this, function (_a) {
                if (!SessionStorageTransport.isSupported()) {
                    return [2 /*return*/, this.failNotSupported()];
                }
                this.keyPrefix = (options === null || options === void 0 ? void 0 : options.sessionStorageKeyPrefix) || DefaultSessionStorageKeyPrefix;
                clients = this.getClientIds(this.keyPrefix);
                this.clientId = this.generateId(clients);
                this.addClientId(clients, this.clientId);
                this.updateClientIds(this.keyPrefix, clients);
                this.subscribeStorage();
                this.isConnected = true;
                state = {
                    connected: this.isConnected,
                };
                this.onConnected(state);
                return [2 /*return*/, state];
            });
        });
    };
    SessionStorageTransport.prototype.failNotSupported = function () {
        var state = {
            connected: false,
            error: 'Session Storage is not supported',
        };
        this.onConnectionError(state);
        return state;
    };
    SessionStorageTransport.prototype.getClientIds = function (prefix) {
        return JSON.parse(localStorage.getItem(prefix + "_clients") || '[]');
    };
    SessionStorageTransport.prototype.updateClientIds = function (prefix, clients) {
        localStorage.setItem(prefix + "_clients", JSON.stringify(clients));
    };
    SessionStorageTransport.prototype.addClientId = function (clients, clientId) {
        clients.push(clientId);
    };
    SessionStorageTransport.prototype.generateId = function (clients) {
        var clientId = this.maxValue(clients);
        ++clientId;
        return clientId;
    };
    SessionStorageTransport.prototype.maxValue = function (a) {
        return (a.length && a.reduce(function (p, v) { return (p > v ? p : v); })) || 0;
    };
    SessionStorageTransport.prototype.subscribeStorage = function () {
        var _this = this;
        if (this.nativeStorageEvent)
            return true;
        this.nativeStorageEvent = onstorage;
        window.addEventListener('storage', function (e) {
            if (e.key === _this.keyPrefix) {
                _this.onlocalStorageChange();
            }
            _this.nativeStorageEvent && _this.nativeStorageEvent.call(window, e);
        });
        window.addEventListener('beforeunload', function (e) { return _this.disconnect(); });
    };
    SessionStorageTransport.prototype.isAllClients = function (msgClients, allClients) {
        return msgClients.length === allClients.length && allClients.some(function (r) { return msgClients.indexOf(r) >= 0; });
    };
    SessionStorageTransport.prototype.removeObsoleteMessages = function (msgClients, key, msgObject) {
        var clients = this.getClientIds(this.keyPrefix);
        if (this.isAllClients(msgClients, clients)) {
            localStorage.removeItem(key);
        }
        else {
            localStorage.setItem(key, JSON.stringify({
                clients: msgClients,
                message: msgObject.message,
            }));
        }
    };
    SessionStorageTransport.prototype.onlocalStorageChange = function () {
        var msgPrefix = this.keyPrefix + "_msg_";
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key === null || key === void 0 ? void 0 : key.startsWith(msgPrefix)) {
                var value = localStorage.getItem(key);
                if (value) {
                    var msgObject = JSON.parse(value);
                    var msgClients = msgObject.clients;
                    if (msgClients.indexOf(this.clientId) === -1) {
                        msgClients.push(this.clientId);
                        this.removeObsoleteMessages(msgClients, key, msgObject);
                        this.onMessage(msgObject.message);
                    }
                }
            }
        }
    };
    SessionStorageTransport.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                state = {
                    connected: this.isConnected,
                };
                if (!this.isConnected) {
                    return [2 /*return*/, {
                            connected: this.isConnected,
                        }];
                }
                state.connected = this.isConnected = false;
                this.unsubscribeStorage();
                this.removeClientId();
                this.onDisconnected(state);
                return [2 /*return*/, state];
            });
        });
    };
    SessionStorageTransport.prototype.unsubscribeStorage = function () {
        if (this.nativeStorageEvent) {
            onstorage = this.nativeStorageEvent;
            this.nativeStorageEvent = null;
        }
    };
    SessionStorageTransport.prototype.removeClientId = function () {
        if (!this.clientId)
            return;
        var clients = this.getClientIds(this.keyPrefix);
        var index = clients.indexOf(this.clientId);
        if (index > -1) {
            clients.splice(index, 1);
            this.updateClientIds(this.keyPrefix, clients);
        }
        this.clientId = 0;
    };
    SessionStorageTransport.prototype.postMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var msgObject;
            return __generator(this, function (_a) {
                if (!this.isConnected)
                    return [2 /*return*/];
                msgObject = {
                    clients: [this.clientId],
                    message: message,
                };
                localStorage.setItem(this.keyPrefix + "_msg_" + +new Date(), JSON.stringify(msgObject));
                localStorage.setItem(this.keyPrefix, new Date().toUTCString());
                return [2 /*return*/];
            });
        });
    };
    return SessionStorageTransport;
}(events));

var BrowserTabIPC = /** @class */ (function (_super) {
    __extends(BrowserTabIPC, _super);
    function BrowserTabIPC(options) {
        var _this = _super.call(this) || this;
        _this.transportTypes = _this.initTransportTypes(options);
        return _this;
    }
    BrowserTabIPC.prototype.onConnected = function (state) {
        this.emit(EventConnected, state);
    };
    BrowserTabIPC.prototype.onConnectionError = function (state) {
        this.emit(EventConnectionError, state);
    };
    BrowserTabIPC.prototype.onDisconnected = function (state) {
        this.emit(EventDisconnected, state);
    };
    BrowserTabIPC.prototype.onMessage = function (state) {
        this.emit(EventMessage, state);
    };
    BrowserTabIPC.prototype.connected = function (callback) {
        return this.on(EventConnected, callback);
    };
    BrowserTabIPC.prototype.connectionError = function (callback) {
        return this.on(EventConnectionError, callback);
    };
    BrowserTabIPC.prototype.disconnected = function (callback) {
        return this.on(EventDisconnected, callback);
    };
    BrowserTabIPC.prototype.message = function (callback) {
        return this.on(EventMessage, callback);
    };
    BrowserTabIPC.prototype.initTransportTypes = function (options) {
        if (!(options === null || options === void 0 ? void 0 : options.transportTypes)) {
            return [TransportType.sharedWorker, TransportType.sessionStorage];
        }
        else if (Array.isArray(options === null || options === void 0 ? void 0 : options.transportTypes) && options.transportTypes.length) {
            return options.transportTypes;
        }
        else {
            return [options.transportTypes];
        }
    };
    BrowserTabIPC.prototype.connect = function (options) {
        var lastTransport = this.transport;
        this.transport = this.selectTransport(this.transport);
        if (!this.transport) {
            return this.failConnect();
        }
        if (this.transport !== lastTransport) {
            this.subscribeTransport();
        }
        return this.transport.connect(options);
    };
    BrowserTabIPC.prototype.selectTransport = function (currentValue) {
        if (!!currentValue)
            return currentValue;
        if (SharedWorkerTransport.isSupported() && this.transportTypes.indexOf(TransportType.sharedWorker) > -1)
            return new SharedWorkerTransport();
        if (SessionStorageTransport.isSupported() && this.transportTypes.indexOf(TransportType.sessionStorage) > -1)
            return new SessionStorageTransport();
    };
    BrowserTabIPC.prototype.subscribeTransport = function () {
        var _this = this;
        this.transport.connected(function (state) { return _this.onConnected(state); });
        this.transport.connectionError(function (state) { return _this.onConnectionError(state); });
        this.transport.disconnected(function (state) { return _this.onDisconnected(state); });
        this.transport.message(function (content) { return _this.onMessage(content); });
    };
    BrowserTabIPC.prototype.failConnect = function () {
        var errorMessage = 'Network transport not found';
        this.onConnectionError({
            connected: false,
            error: errorMessage,
        });
        var reason = {
            error: errorMessage,
            connected: false,
        };
        return Promise.reject(reason);
    };
    BrowserTabIPC.prototype.disconnect = function () {
        var _a, _b;
        this.unsubscribeEvents();
        return (_b = (_a = this.transport) === null || _a === void 0 ? void 0 : _a.disconnect()) !== null && _b !== void 0 ? _b : Promise.reject(new Error('Undefined connection'));
    };
    BrowserTabIPC.prototype.unsubscribeEvents = function () {
        this.removeAllListeners(EventConnected);
        this.removeAllListeners(EventConnectionError);
        this.removeAllListeners(EventDisconnected);
        this.removeAllListeners(EventMessage);
    };
    BrowserTabIPC.prototype.postMessage = function (message) {
        if (!this.transport) {
            this.connect();
        }
        return this.transport.postMessage(message);
    };
    BrowserTabIPC.defaultWorkerUri = '//lopatnov.github.io/browser-tab-ipc/dist/ipc-worker.js';
    return BrowserTabIPC;
}(events));

export { BrowserTabIPC, EventConnected, EventConnectionError, EventDisconnected, EventMessage, TransportType };
//# sourceMappingURL=library.es.js.map
