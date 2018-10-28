import Route from '@ember/routing/route';
import fileObject from "../utils/file-object";
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  router: service(),
  beforeModel(){
    if(this.get('oudaAuth').getRole() !== 'ph'){
      this.transitionTo('home');
    }
  },
  model() {
    var authentication = this.get('oudaAuth');
    var myStore = this.get('store');
    var appointmentsJSON = [];
    var patientProfilesMap = [];
    return myStore.findAll('appointment', {reload: true})
    .then(function(appointments){
      appointments.forEach(function(appointment){
        var appointmentJSON = JSON.parse(JSON.stringify(appointment));
        appointmentJSON.id = appointment.id;
        var now = new Date();
        var then = new Date(appointmentJSON.date);
        if(then>now){
          appointmentJSON.date = then;
          appointmentsJSON.push(appointmentJSON);
          patientProfilesMap[appointmentJSON.patientProfile] = 1;
        }
      });
      return myStore.findAll('patient-profile', {reload: true});
    }).then(function(patientProfiles){
      patientProfiles.forEach(function(patientProfile){
        if(patientProfilesMap[patientProfile.id]){
          var patientProfileJSON = JSON.parse(JSON.stringify(patientProfile));
          patientProfileJSON.id = patientProfile.id;
          patientProfilesMap[patientProfile.id] = patientProfileJSON;
        }
      });
      for(var i = 0; i < appointmentsJSON.length; i++){
        appointmentsJSON[i].patientProfile = patientProfilesMap[appointmentsJSON[i].patientProfile];
      }
      console.log(appointmentsJSON);
      return appointmentsJSON;
    }).catch(function(err){
      alert(err);
    });
  },
});