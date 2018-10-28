define('front-end/components/log-out', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        actions: {
            logout: function logout() {
                var authentication = this.get('oudaAuth');
                if (authentication.userCList) {
                    var identity = localStorage.getItem('sas-session-id');
                    var name = authentication.decrypt(identity);
                    authentication.close(name);
                }
            }
        }
    });
});