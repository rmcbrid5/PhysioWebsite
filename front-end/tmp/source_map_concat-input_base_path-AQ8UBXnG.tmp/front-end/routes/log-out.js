define('front-end/routes/log-out', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            var authentication = this.get('oudaAuth');
            if (authentication.userCList) {
                var identity = localStorage.getItem('sas-session-id');
                var name = authentication.decrypt(identity);
                authentication.close(name);
            }
        }
    });
});