define('semantic-ui-ember/components/ui-modal', ['exports', 'semantic-ui-ember/mixins/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    module: 'modal',
    classNames: ['ui', 'modal'],

    willInitSemantic: function willInitSemantic(settings) {
      this._super.apply(this, arguments);
      if (settings.detachable == null) {
        settings.detachable = false;
      }
      if (settings.observeChanges == null) {
        settings.observeChanges = true;
      }
    }
  });
});