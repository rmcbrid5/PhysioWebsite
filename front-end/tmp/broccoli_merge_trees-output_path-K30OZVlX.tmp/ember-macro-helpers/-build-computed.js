define('ember-macro-helpers/-build-computed', ['exports', 'ember-computed'], function (exports, _emberComputed) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function parseComputedArgs(args) {
    return {
      keys: args.slice(0, -1),
      callback: args[args.length - 1]
    };
  }

  function mapKeysToValues(keys, getValue, context) {
    return keys.map(function (key) {
      return getValue(context, key);
    });
  }

  function buildCallback(collapsedKeys, incomingCallback, getValue) {
    var newCallback = undefined;
    if (typeof incomingCallback === 'function') {
      newCallback = function () {
        var values = mapKeysToValues(collapsedKeys, getValue, this);
        return incomingCallback.apply(this, values);
      };
    } else {
      newCallback = {};
      if (incomingCallback.get) {
        newCallback.get = function () {
          var values = mapKeysToValues(collapsedKeys, getValue, this);
          return incomingCallback.get.apply(this, values);
        };
      }
      if (incomingCallback.set) {
        newCallback.set = incomingCallback.set;
      }
    }

    return newCallback;
  }

  exports['default'] = function (args, collapseKeys, getValue, flattenKeys) {
    var _parseComputedArgs = parseComputedArgs(args);

    var keys = _parseComputedArgs.keys;
    var incomingCallback = _parseComputedArgs.callback;

    var collapsedKeys = collapseKeys(keys);

    var newCallback = buildCallback(collapsedKeys, incomingCallback, getValue);

    return _emberComputed['default'].apply(undefined, _toConsumableArray(flattenKeys(keys)).concat([newCallback]));
  };
});