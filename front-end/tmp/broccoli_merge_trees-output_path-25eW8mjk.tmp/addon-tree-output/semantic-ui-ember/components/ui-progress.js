define('semantic-ui-ember/components/ui-progress', ['exports', 'semantic-ui-ember/mixins/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    module: 'progress',
    classNames: ['ui', 'progress'],
    ignorableAttrs: ['progress']
  });
});