define('front-end/routes/login', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').get('isAuthenticated')) {
                this.get('router').transitionTo('application');
            }
        },
        model: function model() {
            return this.store.findAll('user-account');
        }
    });
});