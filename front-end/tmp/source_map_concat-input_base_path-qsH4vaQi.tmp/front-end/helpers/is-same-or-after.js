define('front-end/helpers/is-same-or-after', ['exports', 'front-end/config/environment', 'ember-moment/helpers/is-same-or-after'], function (exports, _environment, _isSameOrAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isSameOrAfter.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});