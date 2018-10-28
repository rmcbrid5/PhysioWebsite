define('front-end/routes/fill-injury-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        model: function model() {
            var injuryFormsJSON = [];
            var self = this;
            var myStore = this.get('store');

            return myStore.findAll('injury-form').then(function (injuryForms) {
                injuryForms.forEach(function (injuryForm) {
                    var injuryFormJSON = JSON.parse(JSON.stringify(injuryForm));
                    injuryFormJSON.id = injuryForm.id;
                    injuryFormsJSON.push(injuryFormJSON);
                });
                return myStore.findAll('form', { reload: true });
            }).then(function (forms) {
                forms.forEach(function (form) {
                    for (var i = 0; i < injuryFormsJSON.length; i++) {
                        if (injuryFormsJSON[i].form === form.id) {
                            var formJSON = JSON.parse(JSON.stringify(form));
                            formJSON.id = form.id;
                            injuryFormsJSON[i].form = formJSON;
                        }
                    }
                });
                return injuryFormsJSON;
            });
        }
    });
});