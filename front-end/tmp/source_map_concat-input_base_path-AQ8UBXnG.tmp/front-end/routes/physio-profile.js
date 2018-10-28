define('front-end/routes/physio-profile', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ph') {
                this.transitionTo('home');
            }
        },
        model: function model() {
            var self = this;
            var physioJSON;
            return this.get('store').findRecord('physiotherapist', this.get('oudaAuth').getPerson(), { reload: true }).then(function (physio) {
                physioJSON = JSON.parse(JSON.stringify(physio));
                physioJSON.id = physio.id;
                physioJSON.dateHired = new Date(physioJSON.dateHired);
                return self.get('store').findRecord('userAccount', physioJSON.userAccount, { reload: true });
            }).then(function (userAccount) {
                var userAccountJSON = JSON.parse(JSON.stringify(userAccount));
                userAccountJSON.id = userAccount.id;
                physioJSON.userAccount = userAccountJSON;
                return physioJSON;
            });
        }
    });
});