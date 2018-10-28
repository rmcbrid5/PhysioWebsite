define('front-end/routes/admin-profile', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ad') {
                this.transitionTo('home');
            }
        },
        model: function model() {
            var self = this;
            var adminJSON;
            return this.get('store').findRecord('administrator', this.get('oudaAuth').getPerson(), { reload: true }).then(function (admin) {
                adminJSON = JSON.parse(JSON.stringify(admin));
                adminJSON.id = admin.id;
                adminJSON.dateHired = new Date(adminJSON.dateHired);
                return self.get('store').findRecord('userAccount', adminJSON.userAccount, { reload: true });
            }).then(function (userAccount) {
                var userAccountJSON = JSON.parse(JSON.stringify(userAccount));
                userAccountJSON.id = userAccount.id;
                adminJSON.userAccount = userAccountJSON;
                return adminJSON;
            });
        }
    });
});