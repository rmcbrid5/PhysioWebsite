define('front-end/routes/rehab-plans', ['exports'], function (exports) {
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
            var authentication = this.get('oudaAuth');
            var rehabilitationPlansJSON = [];
            return this.store.findAll('rehabilitation-plan').then(function (rehabilitationPlans) {
                rehabilitationPlans.forEach(function (rehabilitationPlan) {
                    var rehabilitationPlanJSON = JSON.parse(JSON.stringify(rehabilitationPlan));
                    rehabilitationPlanJSON.id = rehabilitationPlan.id;
                    if (rehabilitationPlanJSON.physiotherapist === authentication.getPerson()) {
                        rehabilitationPlansJSON.push(rehabilitationPlanJSON);
                    }
                });
                return rehabilitationPlansJSON;
            });
        }
    });
});