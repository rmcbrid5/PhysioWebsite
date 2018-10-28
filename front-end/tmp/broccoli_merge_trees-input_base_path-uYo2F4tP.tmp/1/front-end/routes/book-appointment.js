define('front-end/routes/book-appointment', ['exports'], function (exports) {
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
        },
        model: function model() {
            return this.store.findAll('appointment');
        }
    });
});