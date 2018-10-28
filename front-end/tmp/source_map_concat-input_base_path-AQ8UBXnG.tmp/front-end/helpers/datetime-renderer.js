define('front-end/helpers/datetime-renderer', ['exports', 'ember-datatables/helpers/datetime-renderer'], function (exports, _datetimeRenderer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _datetimeRenderer.default;
    }
  });
  Object.defineProperty(exports, 'datetimeRenderer', {
    enumerable: true,
    get: function () {
      return _datetimeRenderer.datetimeRenderer;
    }
  });
});