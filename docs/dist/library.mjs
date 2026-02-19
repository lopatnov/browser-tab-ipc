function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var events = {exports: {}};

var hasRequiredEvents;

function requireEvents () {
	if (hasRequiredEvents) return events.exports;
	hasRequiredEvents = 1;

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
	events.exports = EventEmitter;
	events.exports.once = once;

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
	return events.exports;
}

var eventsExports = requireEvents();
var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventsExports);

const EventConnected = 'connected';
const EventConnectionError = 'connectionError';
const EventDisconnected = 'disconnected';
const EventMessage = 'message';
const DefaultStorageKeyPrefix = 'ipc';
const DefaultStorageExpiredTime = 30000;

class AbstractTransport extends EventEmitter {
    onConnected(state) {
        this.emit(EventConnected, state);
    }
    onConnectionError(state) {
        this.emit(EventConnectionError, state);
    }
    onDisconnected(state) {
        this.emit(EventDisconnected, state);
    }
    onMessage(message) {
        this.emit(EventMessage, message);
    }
    /**
     * Connected event. It executes callback after establishing connection
     * @param {Action1<ConnectionState>} callback A function with ConnectionState param
     * @return {this} current object
     */
    connected(callback) {
        return this.on(EventConnected, callback);
    }
    /**
     * Connection error event. It executes callback when error occurs.
     * @param {Action1<ConnectionState>} callback A function with ConnectionState param
     * @return {this} current object
     */
    connectionError(callback) {
        return this.on(EventConnectionError, callback);
    }
    /**
     * Disconnected error event. It executes callback after disconnect
     * @param {Action1<ConnectionState>} callback A function with ConnectionState param
     * @return {this} current object
     */
    disconnected(callback) {
        return this.on(EventDisconnected, callback);
    }
    /**
     * Received a message event. It executes callback on message.
     * @param {Action1<any>} callback A function with `any` parameter of received message
     * @return {AbstractTransport} current object
     */
    message(callback) {
        return this.on(EventMessage, callback);
    }
}

var TransportType;
(function (TransportType) {
    TransportType[TransportType["sessionStorage"] = 10] = "sessionStorage";
    TransportType[TransportType["sharedWorker"] = 20] = "sharedWorker";
    TransportType[TransportType["broadcastChannel"] = 30] = "broadcastChannel";
})(TransportType || (TransportType = {}));

class BroadcastChannelTransport extends AbstractTransport {
    constructor() {
        super(...arguments);
        this.transportType = TransportType.broadcastChannel;
    }
    static isSupported() {
        return !!self.BroadcastChannel;
    }
    async connect(options) {
        let state;
        try {
            this.throwIfNotSupported();
            const channel = new BroadcastChannel((options === null || options === void 0 ? void 0 : options.storageKey) || DefaultStorageKeyPrefix);
            channel.onmessage = (e) => this.onMessage(e.data);
            this.channel = channel;
            state = this.getConnectionState();
            this.onConnected(state);
            return state;
        }
        catch (ex) {
            state = this.getConnectionState();
            state.error = ex;
            this.onConnectionError(state);
        }
        throw state;
    }
    async disconnect() {
        var _a;
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.close();
        this.channel = undefined;
        const state = this.getConnectionState();
        this.onDisconnected(state);
        return state;
    }
    async postMessage(message) {
        var _a;
        (_a = this.channel) === null || _a === void 0 ? void 0 : _a.postMessage(message);
    }
    getConnectionState() {
        return {
            type: TransportType.broadcastChannel,
            connected: !!this.channel,
        };
    }
    throwIfNotSupported() {
        if (!BroadcastChannelTransport.isSupported()) {
            const state = this.getConnectionState();
            state.error = new Error('Broadcast Channel is not supported');
            throw state;
        }
    }
}

class SessionStorageTransport extends AbstractTransport {
    constructor() {
        super(...arguments);
        this.transportType = TransportType.sessionStorage;
        this.isConnected = false;
        this.keyPrefix = DefaultStorageKeyPrefix;
        this.messageTime = new Date(0);
        this.messageExpiredTime = DefaultStorageExpiredTime;
        this.lastClearTime = new Date(0);
        this.maxStorageCleanTime = DefaultStorageExpiredTime * 3;
        this.beforeunloadHandler = () => this.disconnect();
        this.storageHandler = (e) => {
            var _a;
            if ((_a = e.key) === null || _a === void 0 ? void 0 : _a.startsWith(this.keyPrefix)) {
                this.onStorageChange();
            }
        };
    }
    static isSupported() {
        return !!localStorage;
    }
    async connect(options) {
        let state;
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
        return state;
    }
    throwIfNotSupported() {
        if (!SessionStorageTransport.isSupported()) {
            const state = this.getConnectionState();
            state.error = new Error('Session Storage is not supported');
            throw state;
        }
    }
    getConnectionState() {
        return {
            type: this.transportType,
            connected: SessionStorageTransport.isSupported() && this.isConnected,
        };
    }
    subscribeStorage() {
        addEventListener('storage', this.storageHandler);
    }
    async disconnect() {
        if (this.clearOldMessagesTimeout) {
            clearTimeout(this.clearOldMessagesTimeout);
            this.clearOldMessagesTimeout = undefined;
        }
        this.clearOldMessages();
        removeEventListener('beforeunload', this.beforeunloadHandler);
        removeEventListener('storage', this.storageHandler);
        this.isConnected = false;
        const state = this.getConnectionState();
        this.onDisconnected(state);
        return state;
    }
    async postMessage(message) {
        if (!this.isConnected)
            return;
        const date = new Date();
        this.setMessageItem(message, date);
        await this.runClearOldMessages();
    }
    setMessageItem(message, date) {
        const key = `${this.keyPrefix}_msg_${date.getTime()}`;
        const msgObject = {
            date: date.toISOString(),
            message,
        };
        const value = JSON.stringify(msgObject);
        this.messageTime = date;
        localStorage.setItem(key, value);
    }
    removeItem(key) {
        localStorage.removeItem(key);
    }
    getKeys(prefix) {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === null || key === void 0 ? void 0 : key.startsWith(prefix)) {
                keys.push(key);
            }
        }
        return keys;
    }
    async clearOldMessages() {
        const keys = this.getKeys(`${this.keyPrefix}_msg_`);
        keys.forEach((key) => {
            const value = localStorage.getItem(key);
            if (value) {
                const msgObject = JSON.parse(value);
                const now = new Date();
                const date = new Date(msgObject.date);
                if (now.getTime() - date.getTime() > this.messageExpiredTime) {
                    this.removeItem(key);
                }
            }
            else {
                this.removeItem(key);
            }
        });
        this.lastClearTime = new Date();
    }
    runClearOldMessages() {
        if (this.clearOldMessagesTimeout) {
            clearTimeout(this.clearOldMessagesTimeout);
        }
        const now = new Date();
        if (now.getTime() - this.lastClearTime.getTime() > this.maxStorageCleanTime) {
            this.clearOldMessages();
        }
        else {
            this.clearOldMessagesTimeout = setTimeout(() => this.clearOldMessages(), this.messageExpiredTime);
        }
    }
    onStorageChange() {
        const keys = this.getKeys(`${this.keyPrefix}_msg_`);
        let maxTime = this.messageTime;
        keys.forEach((key) => {
            const value = localStorage.getItem(key);
            if (value) {
                const msgObject = JSON.parse(value);
                const date = new Date(msgObject.date);
                if (date > this.messageTime) {
                    this.onMessage(msgObject.message);
                    if (date > maxTime) {
                        maxTime = date;
                    }
                }
            }
            else {
                this.removeItem(key);
            }
        });
        this.messageTime = maxTime;
        this.runClearOldMessages();
    }
}

class SharedWorkerTransport extends AbstractTransport {
    constructor() {
        super(...arguments);
        this.beforeunloadHandler = () => this.disconnect();
        this.transportType = TransportType.sharedWorker;
    }
    static isSupported() {
        return !!window.SharedWorker;
    }
    throwIfNotSupported() {
        if (!SharedWorkerTransport.isSupported()) {
            throw new Error('SharedWorker is not supported');
        }
    }
    async connect(options) {
        let state;
        try {
            this.throwIfNotSupported();
            this.throwIfNotWorkerUri(options);
            this.worker = await this.createWorker(options);
            this.startWorker(this.worker);
            state = this.getConnectionState();
            if (state.connected) {
                addEventListener('beforeunload', this.beforeunloadHandler);
                this.onConnected(state);
                return state;
            }
        }
        catch (ex) {
            state = this.getConnectionState();
            state.error = ex;
            this.onConnectionError(state);
        }
        throw state;
    }
    throwIfNotWorkerUri(options) {
        if (options === null || options === void 0 ? void 0 : options.sharedWorkerUri)
            return;
        throw new Error('Worker URI is not defined');
    }
    getConnectionState() {
        var _a;
        return {
            type: this.transportType,
            connected: !!((_a = this.worker) === null || _a === void 0 ? void 0 : _a.port),
        };
    }
    async createWorker(options) {
        const url = options.sharedWorkerUri;
        const isFileExists = await this.isFileExists(url);
        if (!isFileExists) {
            throw new Error(`File ${url} does not exist`);
        }
        return new SharedWorker(url);
    }
    isFileExists(url) {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', url);
            xhr.timeout = 5000;
            xhr.ontimeout = () => resolve(false);
            xhr.send();
            xhr.onload = () => {
                resolve(xhr.status < 400);
            };
            xhr.onerror = () => {
                resolve(false);
            };
        });
    }
    startWorker(worker) {
        worker.port.onmessage = (ev) => {
            this.onMessage(ev.data.message);
        };
        worker.port.start();
    }
    async disconnect() {
        var _a, _b;
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
        const state = this.getConnectionState();
        this.onDisconnected(state);
        return state;
    }
    async postMessage(message) {
        var _a;
        (_a = this.worker) === null || _a === void 0 ? void 0 : _a.port.postMessage({
            cmd: 'm',
            message,
        });
    }
}

function transportFabric(transportType) {
    switch (transportType) {
        case TransportType.sessionStorage:
            return new SessionStorageTransport();
        case TransportType.sharedWorker:
            return new SharedWorkerTransport();
        case TransportType.broadcastChannel:
            return new BroadcastChannelTransport();
        default:
            throw new Error(`Unknown transport type: ${transportType}`);
    }
}

class BrowserTabIPC extends AbstractTransport {
    constructor(options) {
        super();
        this.options = {};
        this.extendOptions(options);
    }
    get transportType() {
        var _a;
        return (_a = this.transport) === null || _a === void 0 ? void 0 : _a.transportType;
    }
    extendOptions(options) {
        this.options = { ...this.options, ...options };
        this.options.transportTypes = this.initTransportTypes(options);
        this.options.sharedWorkerUri = this.options.sharedWorkerUri || BrowserTabIPC.defaultWorkerUri;
        this.options.storageKey = this.options.storageKey || DefaultStorageKeyPrefix;
        this.options.storageExpiredTime = this.options.storageExpiredTime || DefaultStorageExpiredTime;
    }
    initTransportTypes(options) {
        if (!(options === null || options === void 0 ? void 0 : options.transportTypes) || (Array.isArray(options === null || options === void 0 ? void 0 : options.transportTypes) && !options.transportTypes.length)) {
            return [TransportType.broadcastChannel, TransportType.sharedWorker, TransportType.sessionStorage];
        }
        else if (Array.isArray(options === null || options === void 0 ? void 0 : options.transportTypes) && options.transportTypes.length) {
            return options.transportTypes;
        }
        else {
            return [options.transportTypes];
        }
    }
    connect(options) {
        var _a;
        if (this.transport) {
            return Promise.resolve({ type: (_a = this.transport.transportType) !== null && _a !== void 0 ? _a : null, connected: true });
        }
        this.extendOptions(options);
        return this.connectTransport(this.options).then((state) => {
            this.subscribeTransport();
            return state;
        });
    }
    connectTransport(options, index = 0) {
        if (!Array.isArray(options.transportTypes) || !options.transportTypes.length || index >= options.transportTypes.length || !options.transportTypes[index]) {
            return this.failConnect();
        }
        this.transport = transportFabric(options.transportTypes[index]);
        return this.transport.connect(options).catch((error) => {
            ++index;
            if (Array.isArray(options.transportTypes) && index < options.transportTypes.length) {
                return this.connectTransport(options, index);
            }
            throw error;
        });
    }
    subscribeTransport() {
        this.transport.connected((state) => this.onConnected(state));
        this.transport.connectionError((state) => this.onConnectionError(state));
        this.transport.disconnected((state) => this.onDisconnected(state));
        this.transport.message((content) => this.onMessage(content));
    }
    unsubscribeTransport() {
        var _a, _b, _c, _d;
        (_a = this.transport) === null || _a === void 0 ? void 0 : _a.removeAllListeners(EventConnected);
        (_b = this.transport) === null || _b === void 0 ? void 0 : _b.removeAllListeners(EventConnectionError);
        (_c = this.transport) === null || _c === void 0 ? void 0 : _c.removeAllListeners(EventDisconnected);
        (_d = this.transport) === null || _d === void 0 ? void 0 : _d.removeAllListeners(EventMessage);
    }
    failConnect() {
        const reason = {
            type: null,
            error: 'Network transport not found',
            connected: false,
        };
        this.onConnectionError(reason);
        return Promise.reject(reason);
    }
    disconnect() {
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
    }
    unsubscribeEvents() {
        this.removeAllListeners(EventConnected);
        this.removeAllListeners(EventConnectionError);
        this.removeAllListeners(EventDisconnected);
        this.removeAllListeners(EventMessage);
    }
    async postMessage(message) {
        if (!this.transport) {
            await this.connect();
        }
        return this.transport.postMessage(message);
    }
}
BrowserTabIPC.defaultWorkerUri = '//lopatnov.github.io/browser-tab-ipc/dist/ipc-worker.js';

export { BrowserTabIPC, EventConnected, EventConnectionError, EventDisconnected, EventMessage, TransportType };
//# sourceMappingURL=library.mjs.map
