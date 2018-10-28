define('front-end/components/login-user', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        router: Ember.inject.service(),
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        error: null,
        tempPassword: null,
        isPasswordChanging: null,
        actions: {
            login: function login() {
                var authentication = this.get('oudaAuth');
                var self = this;
                if (!self.get('userAccountName')) {
                    alert('Please enter your User Account Name.');
                    return false;
                }
                if (!self.get('password')) {
                    alert('Please enter your Password.');
                    return false;
                }
                self.set('error', null);
                authentication.open(this.get('userAccountName').toLowerCase(), this.get('password')).then(function () {
                    self.get('oudaAuth').set('isLoginRequested', false);
                    authentication.set('getName', self.get('userAccountName').toLowerCase());
                    self.get('router').transitionTo('home');
                }).catch(function (err) {
                    alert(err);
                });
            }
        }
    });
});