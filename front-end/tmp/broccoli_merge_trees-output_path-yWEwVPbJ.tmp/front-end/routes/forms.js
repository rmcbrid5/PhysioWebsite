define('front-end/routes/forms', ['exports'], function (exports) {
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
      var formsJSON = [];
      var adminMap = [];
      var self = this;
      return myStore.findAll('form').then(function (forms) {
        forms.forEach(function (form) {
          var formJSON = JSON.parse(JSON.stringify(form));
          formJSON.id = form.id;
          formsJSON.push(formJSON);
        });
        return myStore.findAll('administrator');
      }).then(function (admins) {
        admins.forEach(function (admin) {
          var adminJSON = JSON.parse(JSON.stringify(admin));
          adminJSON.id = admin.id;
          adminMap[admin.id] = adminJSON;
        });
        for (var i = 0; i < formsJSON.length; i++) {
          formsJSON[i].administrator = adminMap[formsJSON[i].administrator];
        }
        return formsJSON;
      });
    }
  });
});