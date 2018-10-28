define('semantic-ui-ember/components/ui-radio', ['exports', 'semantic-ui-ember/mixins/checkbox', 'ember-promise-tools/utils/is-promise', 'ember-promise-tools/utils/is-fulfilled', 'ember-promise-tools/utils/get-promise-content', 'ember-promise-tools/mixins/promise-resolver'], function (exports, _checkbox, _isPromise, _isFulfilled, _getPromiseContent, _promiseResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_checkbox.default, _promiseResolver.default, {
    type: 'radio',
    classNames: ['radio'],
    ignorableAttrs: ['checked', 'label', 'disabled', 'value', 'current'],

    init: function init() {
      this._super.apply(this, arguments);

      if (Ember.isBlank(this.get('name'))) {
        this.set('name', 'default');
        Ember.Logger.warn("The required component parameter of 'name' was not passed into the ui-radio component");
      }
    },


    // Internal wrapper for onchange, to pass through checked
    _onChange: function _onChange() {
      var value = this.get('value');
      return this.attrs.onChange(value, this);
    },
    didInitSemantic: function didInitSemantic() {
      this._super.apply(this, arguments);
      this._inspectValueAndCurrent();
    },
    didUpdateAttrs: function didUpdateAttrs() {
      this._super.apply(this, arguments);
      this._inspectValueAndCurrent();
    },
    _inspectValueAndCurrent: function _inspectValueAndCurrent() {
      var value = this.get('value');
      var current = this.get('current');
      // If either are a promise, we need to make sure both are resolved
      // Or wait for them to resolve
      if ((0, _isPromise.default)(value) || (0, _isPromise.default)(current)) {

        // This code is probably overkill, but i wanted to ensure that
        // if the promises are resolved we render as soon as possible instead of waiting
        // for the hash to resolve each time
        if ((0, _isPromise.default)(value)) {
          if (!(0, _isFulfilled.default)(value)) {
            return this.resolvePromise(Ember.RSVP.hash({ value: value, current: current }), this._checkValueAndCurrent);
          } else {
            value = (0, _getPromiseContent.default)(value);
          }
        }

        if ((0, _isPromise.default)(current)) {
          if (!(0, _isFulfilled.default)(current)) {
            return this.resolvePromise(Ember.RSVP.hash({ value: value, current: current }), this._checkValueAndCurrent);
          } else {
            current = (0, _getPromiseContent.default)(current);
          }
        }
      }
      // If we didn't return, the promises are either fulfilled or not promises
      this._checkValueAndCurrent({ value: value, current: current });
    },
    _checkValueAndCurrent: function _checkValueAndCurrent(hash) {
      var isChecked = this.execute('is checked');
      if (this.areAttrValuesEqual('checked', hash.value, hash.current)) {
        // Value and current match, but radio isn't checked, return false
        if (!isChecked) {
          return this.execute('set checked');
        }
      } else {
        // Value and current don't match and radio is checked, return false
        if (isChecked) {
          return this.execute('set unchecked');
        }
      }
    }
  });
});