define('semantic-ui-ember/components/ui-embed', ['exports', 'semantic-ui-ember/mixins/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    module: 'embed',
    classNames: ['ui', 'embed'],
    attributeBindings: ['data-icon', 'data-id', 'data-placeholder', 'data-source', 'data-url'],
    ignorableAttrs: ['data-icon', 'data-id', 'data-placeholder', 'data-source', 'data-url']
  });
});