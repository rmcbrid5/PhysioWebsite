define('front-end/routes/make-payment', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'pa') {
                this.get('router').transitionTo('home');
            }
        }
    });
});