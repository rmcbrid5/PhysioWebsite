define('front-end/models/to-do-list', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    task: _emberData.default.attr('string'),
    completed: _emberData.default.attr('boolean', { defaultValue: false })
  });
});