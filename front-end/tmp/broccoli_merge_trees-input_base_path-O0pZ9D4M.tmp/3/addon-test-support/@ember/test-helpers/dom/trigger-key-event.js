define('@ember/test-helpers/dom/trigger-key-event', ['exports', '@ember/test-helpers/dom/-get-element', '@ember/test-helpers/dom/fire-event', '@ember/test-helpers/settled', '@ember/test-helpers/-utils'], function (exports, _getElement, _fireEvent, _settled, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = triggerKeyEvent;


  var DEFAULT_MODIFIERS = Object.freeze({
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false
  });

  /**
    Triggers a keyboard event on the specified target.
  
    @public
    @param {string|Element} target the element or selector to trigger the event on
    @param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
    @param {string} keyCode the keyCode of the event being triggered
    @param {Object} [modifiers] the state of various modifier keys
    @param {boolean} [modifiers.ctrlKey=false] if true the generated event will indicate the control key was pressed during the key event
    @param {boolean} [modifiers.altKey=false] if true the generated event will indicate the alt key was pressed during the key event
    @param {boolean} [modifiers.shiftKey=false] if true the generated event will indicate the shift key was pressed during the key event
    @param {boolean} [modifiers.metaKey=false] if true the generated event will indicate the meta key was pressed during the key event
    @return {Promise<void>} resolves when the application is settled
  */
  function triggerKeyEvent(target, eventType, keyCode) {
    var modifiers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_MODIFIERS;

    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `triggerKeyEvent`.');
      }

      var element = (0, _getElement.default)(target);
      if (!element) {
        throw new Error('Element not found when calling `triggerKeyEvent(\'' + target + '\', ...)`.');
      }

      if (!eventType) {
        throw new Error('Must provide an `eventType` to `triggerKeyEvent`');
      }

      if (_fireEvent.KEYBOARD_EVENT_TYPES.indexOf(eventType) === -1) {
        var validEventTypes = _fireEvent.KEYBOARD_EVENT_TYPES.join(', ');
        throw new Error('Must provide an `eventType` of ' + validEventTypes + ' to `triggerKeyEvent` but you passed `' + eventType + '`.');
      }

      if (!keyCode) {
        throw new Error('Must provide a `keyCode` to `triggerKeyEvent`');
      }

      var options = Ember.merge({ keyCode: keyCode, which: keyCode, key: keyCode }, modifiers);

      (0, _fireEvent.default)(element, eventType, options);

      return (0, _settled.default)();
    });
  }
});