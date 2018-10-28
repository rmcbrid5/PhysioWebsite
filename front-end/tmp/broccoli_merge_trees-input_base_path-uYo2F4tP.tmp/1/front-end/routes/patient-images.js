define('front-end/routes/patient-images', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    store: Ember.inject.service(),
    router: Ember.inject.service(),
    beforeModel: function beforeModel() {
      if (this.get('oudaAuth').getRole() !== 'ph') {
        this.transitionTo('home');
      }
    },
    model: function model() {
      var authentication = this.get('oudaAuth');
      var myStore = this.get('store');
      var patientProfilesJSON = [];
      return myStore.findAll('patient-profile', { reload: true });
    }
  });
});