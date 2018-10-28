define('front-end/routes/patient-profiles', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ph') {
                this.get('router').transitionTo('home');
            }
        },
        model: function model() {
            return this.get('store').findAll('patient-profile', { reload: true });
        }
    });
});