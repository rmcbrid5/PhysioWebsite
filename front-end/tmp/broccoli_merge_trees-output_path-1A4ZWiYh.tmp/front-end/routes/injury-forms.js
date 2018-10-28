define('front-end/routes/injury-forms', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ad') {
                this.get('router').transitionTo('home');
            }
        },
        model: function model() {
            var self = this;
            var myStore = this.get('store');

            var injuryFormsJSON = [];
            var formMap = [];
            return myStore.findAll('injuryForm', { reload: true }).then(function (injuryForms) {
                injuryForms.forEach(function (injuryForm) {
                    var injuryFormJSON = JSON.parse(JSON.stringify(injuryForm));
                    injuryFormJSON.id = injuryForm.id;
                    injuryFormsJSON.push(injuryFormJSON);
                });
                return myStore.findAll('form', { reload: true });
            }).then(function (forms) {
                forms.forEach(function (form) {
                    var formJSON = JSON.parse(JSON.stringify(form));
                    formJSON.id = form.id;
                    formMap[form.id] = formJSON;
                });
                for (var i = 0; i < injuryFormsJSON.length; i++) {
                    injuryFormsJSON[i].form = formMap[injuryFormsJSON[i].form];
                }
                return injuryFormsJSON;
            });
        }
    });
});