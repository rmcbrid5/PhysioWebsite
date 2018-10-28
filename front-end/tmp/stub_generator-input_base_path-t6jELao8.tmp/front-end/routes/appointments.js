define('front-end/routes/appointments', ['exports', 'front-end/utils/file-object'], function (exports, _fileObject) {
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
      var appointmentsJSON = [];
      var patientProfilesMap = [];
      return myStore.findAll('appointment', { reload: true }).then(function (appointments) {
        appointments.forEach(function (appointment) {
          var appointmentJSON = JSON.parse(JSON.stringify(appointment));
          appointmentJSON.id = appointment.id;
          var now = new Date();
          var then = new Date(appointmentJSON.date);
          if (then > now) {
            appointmentJSON.date = then;
            appointmentsJSON.push(appointmentJSON);
            patientProfilesMap[appointmentJSON.patientProfile] = 1;
          }
        });
        return myStore.findAll('patient-profile', { reload: true });
      }).then(function (patientProfiles) {
        patientProfiles.forEach(function (patientProfile) {
          if (patientProfilesMap[patientProfile.id]) {
            var patientProfileJSON = JSON.parse(JSON.stringify(patientProfile));
            patientProfileJSON.id = patientProfile.id;
            patientProfilesMap[patientProfile.id] = patientProfileJSON;
          }
        });
        for (var i = 0; i < appointmentsJSON.length; i++) {
          appointmentsJSON[i].patientProfile = patientProfilesMap[appointmentsJSON[i].patientProfile];
        }
        console.log(appointmentsJSON);
        return appointmentsJSON;
      }).catch(function (err) {
        alert(err);
      });
    }
  });
});