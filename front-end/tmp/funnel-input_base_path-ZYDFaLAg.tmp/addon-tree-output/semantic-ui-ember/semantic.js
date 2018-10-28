define('semantic-ui-ember/semantic', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Semantic = Ember.Namespace.create({
    UI_DEBUG: false,
    UI_PERFORMANCE: false,
    UI_VERBOSE: false
  });

  exports.default = Semantic;
});