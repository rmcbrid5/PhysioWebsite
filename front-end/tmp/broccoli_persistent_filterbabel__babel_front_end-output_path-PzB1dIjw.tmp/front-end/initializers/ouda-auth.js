define('front-end/initializers/ouda-auth', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(application) {
    application.inject('route', 'oudaAuth', 'service:ouda-auth'), application.inject('controller', 'oudaAuth', 'service:ouda-auth'), application.inject('component', 'oudaAuth', 'service:ouda-auth');
  }

  exports.default = {
    name: 'ouda-auth',
    initialize: initialize
  };
});