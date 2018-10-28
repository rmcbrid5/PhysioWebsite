define('front-end/routes/application', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            var authentication = this.get('oudaAuth');
            authentication.set('isLoginRequested', false);
            var self = this;

            if (!localStorage.getItem('sas-session-id')) {
                this.get('router').transitionTo('home');
                return;
            }
            authentication.fetch().then(function (res) {
                self.get('router').transitionTo('home');
            }).catch(function (err) {
                self.get('router').transitionTo('home');
            });
        }
    });
});