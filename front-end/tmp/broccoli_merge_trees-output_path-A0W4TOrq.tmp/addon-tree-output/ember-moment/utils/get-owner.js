define('ember-moment/utils/get-owner', ['exports', 'ember'], function (exports, _ember) {

  var getOwner = _ember['default'].getOwner;

  if (!getOwner) {
    try {
      getOwner = require('ember-getowner-polyfill')['default'];
    } catch (e) {
      _ember['default'].Logger.warn('Ember.getOwner API unsupported.  To resolve this: `ember install ember-getowner-polyfill`');
    }
  }

  exports['default'] = getOwner;
});
/* globals require */