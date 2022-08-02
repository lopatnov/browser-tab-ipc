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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

var EventConnected = 'connected';
var EventConnectionError = 'connectionError';
var EventDisconnected = 'disconnected';
var EventMessage = 'message';
var DefaultStorageKeyPrefix = 'ipc';
var DefaultStorageExpiredTime = 30000;

var AbstractTransport = /** @class */ (function (_super) {
    __extends(AbstractTransport, _super);
    function AbstractTransport() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractTransport.prototype.onConnected = function (state) {
        this.emit(EventConnected, state);
    };
    AbstractTransport.prototype.onConnectionError = function (state) {
        this.emit(EventConnectionError, state);
    };
    AbstractTransport.prototype.onDisconnected = function (state) {
        this.emit(EventDisconnected, state);
    };
    AbstractTransport.prototype.onMessage = function (state) {
        this.emit(EventMessage, state);
    };
    /**
     * Connected event. It executes callback after establishing connection
     * @param {Action1<ConnectionState>} callback A function with ConnectionState param
     * @return {this} current object
     */
    AbstractTransport.prototype.connected = function (callback) {
        return this.on(EventConnected, callback);
    };
    /**
     * Connection error event. It executes callback when error occurs.
     * @param {Action1<ConnectionState>} callback A function with ConnectionState param
     * @return {this} current object
     */
    AbstractTransport.prototype.connectionError = function (callback) {
        return this.on(EventConnectionError, callback);
    };
    /**
     * Disconnected error event. It executes callback after disconnect
     * @param {Action1<ConnectionState>} callback A function with ConnectionState param
     * @return {this} current object
     */
    AbstractTransport.prototype.disconnected = function (callback) {
        return this.on(EventDisconnected, callback);
    };
    /**
     * Received a message event. It executes callback on message.
     * @param {Action1<any>} callback A function with `any` parameter of received message
     * @return {AbstractTransport} current object
     */
    AbstractTransport.prototype.message = function (callback) {
        return this.on(EventMessage, callback);
    };
    return AbstractTransport;
}(events));

var TransportType;
(function (TransportType) {
    TransportType[TransportType["sessionStorage"] = 10] = "sessionStorage";
    TransportType[TransportType["sharedWorker"] = 20] = "sharedWorker";
    TransportType[TransportType["broadcastChannel"] = 30] = "broadcastChannel";
})(TransportType || (TransportType = {}));

var SessionStorageTransport = /** @class */ (function (_super) {
    __extends(SessionStorageTransport, _super);
    function SessionStorageTransport() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.transportType = TransportType.sessionStorage;
        _this.isConnected = false;
        _this.keyPrefix = DefaultStorageKeyPrefix;
        _this.messageTime = new Date(0, 0, 0, 0, 0, 0, 0);
        _this.messageExpiredTime = DefaultStorageExpiredTime;
        _this.lastClearTime = new Date(0, 0, 0, 0, 0, 0, 0);
        _this.maxStorageCleanTime = DefaultStorageExpiredTime * 3;
        _this.beforeunloadHandler = function () { return _this.disconnect(); };
        _this.storageHandler = function (e) {
            var _a;
            if ((_a = e.key) === null || _a === void 0 ? void 0 : _a.startsWith(_this.keyPrefix)) {
                _this.onStorageChange();
            }
        };
        return _this;
    }
    SessionStorageTransport.isSupported = function () {
        return !!localStorage;
    };
    SessionStorageTransport.prototype.connect = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                try {
                    this.throwIfNotSupported();
                    this.keyPrefix = (options === null || options === void 0 ? void 0 : options.storageKey) || DefaultStorageKeyPrefix;
                    this.messageExpiredTime = (options === null || options === void 0 ? void 0 : options.storageExpiredTime) || DefaultStorageExpiredTime;
                    this.maxStorageCleanTime = this.messageExpiredTime * 3;
                    this.subscribeStorage();
                    window.addEventListener('beforeunload', this.beforeunloadHandler);
                    this.messageTime = new Date();
                    this.isConnected = true;
                    state = this.getConnectionState();
                    this.onConnected(state);
                }
                catch (ex) {
                    state = this.getConnectionState();
                    state.error = ex;
                    this.onConnectionError(state);
                    throw state;
                }
                return [2 /*return*/, state];
            });
        });
    };
    SessionStorageTransport.prototype.throwIfNotSupported = function () {
        if (!SessionStorageTransport.isSupported()) {
            var state = this.getConnectionState();
            state.error = new Error('Session Storage is not supported');
            throw state;
        }
    };
    SessionStorageTransport.prototype.getConnectionState = function () {
        return {
            type: this.transportType,
            connected: SessionStorageTransport.isSupported() && this.isConnected,
        };
    };
    SessionStorageTransport.prototype.subscribeStorage = function () {
        addEventListener('storage', this.storageHandler);
    };
    SessionStorageTransport.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                this.clearOldMessages();
                removeEventListener('beforeunload', this.beforeunloadHandler);
                removeEventListener('storage', this.storageHandler);
                this.isConnected = false;
                state = this.getConnectionState();
                this.onDisconnected(state);
                return [2 /*return*/, state];
            });
        });
    };
    SessionStorageTransport.prototype.postMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var date;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connected)
                            return [2 /*return*/];
                        date = new Date();
                        this.setMessageItem(message, date);
                        return [4 /*yield*/, this.runClearOldMessages()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SessionStorageTransport.prototype.setMessageItem = function (message, date) {
        var key = this.keyPrefix + "_msg_" + date.getTime();
        var msgObject = {
            date: date,
            message: message,
        };
        var value = JSON.stringify(msgObject);
        this.messageTime = date;
        localStorage.setItem(key, value);
    };
    SessionStorageTransport.prototype.removeItem = function (key) {
        localStorage.removeItem(key);
    };
    SessionStorageTransport.prototype.getKeys = function (prefix) {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key === null || key === void 0 ? void 0 : key.startsWith(prefix)) {
                keys.push(key);
            }
        }
        return keys;
    };
    SessionStorageTransport.prototype.clearOldMessages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            var _this = this;
            return __generator(this, function (_a) {
                keys = this.getKeys(this.keyPrefix + "_msg_");
                keys.forEach(function (key) {
                    var value = localStorage.getItem(key);
                    try {
                        if (value) {
                            var msgObject = JSON.parse(value);
                            var now = new Date();
                            var dateStr = msgObject === null || msgObject === void 0 ? void 0 : msgObject.date;
                            var date = new Date(dateStr);
                            if (!date || now.getTime() - date.getTime() > _this.messageExpiredTime) {
                                _this.removeItem(key);
                            }
                        }
                        else {
                            _this.removeItem(key);
                        }
                    }
                    finally {
                    }
                });
                this.lastClearTime = new Date();
                return [2 /*return*/];
            });
        });
    };
    SessionStorageTransport.prototype.runClearOldMessages = function () {
        var _this = this;
        if (this.clearOldMessagesTimeout) {
            clearTimeout(this.clearOldMessagesTimeout);
        }
        var now = new Date();
        if (now.getTime() - this.lastClearTime.getTime() > this.maxStorageCleanTime) {
            this.clearOldMessages();
        }
        else {
            this.clearOldMessagesTimeout = setTimeout(function () { return _this.clearOldMessages(); }, this.messageExpiredTime);
        }
    };
    SessionStorageTransport.prototype.onStorageChange = function () {
        var _this = this;
        var keys = this.getKeys(this.keyPrefix + "_msg_");
        var maxTime = this.messageTime;
        keys.forEach(function (key) {
            var value = localStorage.getItem(key);
            try {
                if (value) {
                    var msgObject = JSON.parse(value);
                    var dateStr = msgObject === null || msgObject === void 0 ? void 0 : msgObject.date;
                    var date = new Date(dateStr);
                    if (date > _this.messageTime) {
                        _this.onMessage(msgObject.message);
                        if (date > maxTime) {
                            maxTime = date;
                        }
                    }
                }
                else {
                    _this.removeItem(key);
                }
            }
            finally {
            }
        });
        this.messageTime = maxTime;
        this.runClearOldMessages();
    };
    return SessionStorageTransport;
}(AbstractTransport));

var SharedWorkerTransport = /** @class */ (function (_super) {
    __extends(SharedWorkerTransport, _super);
    function SharedWorkerTransport() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.beforeunloadHandler = function () { return _this.disconnect(); };
        _this.transportType = TransportType.sharedWorker;
        return _this;
    }
    SharedWorkerTransport.isSupported = function () {
        return !!window.SharedWorker;
    };
    SharedWorkerTransport.prototype.throwIfNotSupported = function () {
        if (!SharedWorkerTransport.isSupported()) {
            throw new Error('SharedWorker is not supported');
        }
    };
    SharedWorkerTransport.prototype.connect = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var state, _a, ex_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.throwIfNotSupported();
                        this.throwIfNotWorkerUri(options);
                        _a = this;
                        return [4 /*yield*/, this.createWorker(options)];
                    case 1:
                        _a.worker = _b.sent();
                        this.startWorker(this.worker);
                        state = this.getConnectionState();
                        if (state.connected) {
                            addEventListener('beforeunload', this.beforeunloadHandler);
                            this.onConnected(state);
                            return [2 /*return*/, state];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        ex_1 = _b.sent();
                        state = this.getConnectionState();
                        state.error = ex_1;
                        this.onConnectionError(state);
                        return [3 /*break*/, 3];
                    case 3: throw state;
                }
            });
        });
    };
    SharedWorkerTransport.prototype.throwIfNotWorkerUri = function (options) {
        if (options === null || options === void 0 ? void 0 : options.sharedWorkerUri)
            return;
        throw new Error('Worker URI is not defined');
    };
    SharedWorkerTransport.prototype.getConnectionState = function () {
        var _a;
        return {
            type: this.transportType,
            connected: !!((_a = this.worker) === null || _a === void 0 ? void 0 : _a.port),
        };
    };
    SharedWorkerTransport.prototype.createWorker = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, isFileExists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = options.sharedWorkerUri;
                        return [4 /*yield*/, this.isFileExists(url)];
                    case 1:
                        isFileExists = _a.sent();
                        if (!isFileExists) {
                            throw new Error("File " + url + " does not exist");
                        }
                        return [2 /*return*/, new SharedWorker(url)];
                }
            });
        });
    };
    SharedWorkerTransport.prototype.isFileExists = function (url) {
        return new Promise(function (resolve) {
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url);
            xhr.send();
            xhr.onload = function () {
                resolve(xhr.status < 400);
            };
            xhr.onerror = function () {
                resolve(false);
            };
        });
    };
    SharedWorkerTransport.prototype.startWorker = function (worker) {
        var _this = this;
        worker.port.onmessage = function (ev) {
            _this.onMessage(ev.data.message);
        };
        worker.port.start();
    };
    SharedWorkerTransport.prototype.disconnect = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_c) {
                if (this.worker) {
                    try {
                        this.worker.port.postMessage({
                            cmd: 'x',
                        });
                    }
                    finally {
                        (_b = (_a = this.worker) === null || _a === void 0 ? void 0 : _a.port) === null || _b === void 0 ? void 0 : _b.close();
                        this.worker = undefined;
                    }
                    removeEventListener('beforeunload', this.beforeunloadHandler);
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
}(AbstractTransport));

function transportFabric(transportType) {
    switch (transportType) {
        case TransportType.sessionStorage:
            return new SessionStorageTransport();
        case TransportType.sharedWorker:
            return new SharedWorkerTransport();
        default:
            throw new Error("Unknown transport type: " + transportType);
    }
}

var BrowserTabIPC = /** @class */ (function (_super) {
    __extends(BrowserTabIPC, _super);
    function BrowserTabIPC(options) {
        var _this = _super.call(this) || this;
        _this.options = {};
        _this.extendOptions(options);
        return _this;
    }
    Object.defineProperty(BrowserTabIPC.prototype, "transportType", {
        get: function () {
            var _a;
            return (_a = this.transport) === null || _a === void 0 ? void 0 : _a.transportType;
        },
        enumerable: false,
        configurable: true
    });
    BrowserTabIPC.prototype.extendOptions = function (options) {
        this.options = __assign(__assign({}, this.options), options);
        this.options.transportTypes = this.initTransportTypes(options);
        this.options.sharedWorkerUri = this.options.sharedWorkerUri || BrowserTabIPC.defaultWorkerUri;
        this.options.storageKey = this.options.storageKey || DefaultStorageKeyPrefix;
        this.options.storageExpiredTime = this.options.storageExpiredTime || DefaultStorageExpiredTime;
    };
    BrowserTabIPC.prototype.initTransportTypes = function (options) {
        if (!(options === null || options === void 0 ? void 0 : options.transportTypes) || (Array.isArray(options === null || options === void 0 ? void 0 : options.transportTypes) && !options.transportTypes.length)) {
            return [TransportType.broadcastChannel, TransportType.sharedWorker, TransportType.sessionStorage];
        }
        else if (Array.isArray(options === null || options === void 0 ? void 0 : options.transportTypes) && options.transportTypes.length) {
            return options.transportTypes;
        }
        else {
            return [options.transportTypes];
        }
    };
    BrowserTabIPC.prototype.connect = function (options) {
        var _this = this;
        this.extendOptions(options);
        return this.connectTransport(this.options).then(function (state) {
            _this.subscribeTransport();
            return state;
        });
    };
    BrowserTabIPC.prototype.connectTransport = function (options, index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        if (!Array.isArray(options.transportTypes) || !options.transportTypes.length || index >= options.transportTypes.length || !options.transportTypes[index]) {
            return this.failConnect();
        }
        this.transport = transportFabric(options.transportTypes[index]);
        return this.transport.connect(options).catch(function (error) {
            ++index;
            if (Array.isArray(options.transportTypes) && index < options.transportTypes.length) {
                return _this.connectTransport(options, index);
            }
            throw error;
        });
    };
    BrowserTabIPC.prototype.subscribeTransport = function () {
        var _this = this;
        this.transport.connected(function (state) { return _this.onConnected(state); });
        this.transport.connectionError(function (state) { return _this.onConnectionError(state); });
        this.transport.disconnected(function (state) { return _this.onDisconnected(state); });
        this.transport.message(function (content) { return _this.onMessage(content); });
    };
    BrowserTabIPC.prototype.unsubscribeTransport = function () {
        var _a, _b, _c, _d;
        (_a = this.transport) === null || _a === void 0 ? void 0 : _a.removeAllListeners(EventConnected);
        (_b = this.transport) === null || _b === void 0 ? void 0 : _b.removeAllListeners(EventConnectionError);
        (_c = this.transport) === null || _c === void 0 ? void 0 : _c.removeAllListeners(EventDisconnected);
        (_d = this.transport) === null || _d === void 0 ? void 0 : _d.removeAllListeners(EventMessage);
    };
    BrowserTabIPC.prototype.failConnect = function () {
        var reason = {
            type: null,
            error: 'Network transport not found',
            connected: false,
        };
        this.onConnectionError(reason);
        return Promise.reject(reason);
    };
    BrowserTabIPC.prototype.disconnect = function () {
        var _a, _b;
        try {
            this.unsubscribeTransport();
            return (_b = (_a = this.transport) === null || _a === void 0 ? void 0 : _a.disconnect()) !== null && _b !== void 0 ? _b : Promise.reject(new Error('Undefined connection'));
        }
        catch (error) {
            return Promise.reject(error);
        }
        finally {
            this.unsubscribeEvents();
        }
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
}(AbstractTransport));

export { BrowserTabIPC, EventConnected, EventConnectionError, EventDisconnected, EventMessage, TransportType };
//# sourceMappingURL=library.es.js.map
