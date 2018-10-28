define('semantic-ui-ember/components/ui-checkbox', ['exports', 'semantic-ui-ember/mixins/checkbox'], function (exports, _checkbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_checkbox.default, {
    type: 'checkbox',
    ignorableAttrs: ['checked', 'label', 'disabled'],

    // Internal wrapper for onchange, to pass through checked
    _onChange: function _onChange() {
      var checked = this.execute('is checked');
      return this.attrs.onChange(checked, this);
    }
  });
});