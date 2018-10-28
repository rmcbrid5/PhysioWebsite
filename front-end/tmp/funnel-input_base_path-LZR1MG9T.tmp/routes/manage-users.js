import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Route.extend({
    store: service(),
    DS : inject('store'),
    router: service(),
    beforeModel() {
        if(this.get('oudaAuth').getRole() !== 'ad'){
            this.get('router').transitionTo('home');
        }
    },
    model(){
        var self = this;
        var myStore = this.get('store');
        var patientProfilesJSON = [];
        var physiotherapistsJSON = [];

        var userAccountsJSON = [];

        var patientProfilesMap = [];
        var physiotherapistsMap = [];

        return this.store.findAll('userAccount', {reload: true})
        .then(function(userAccounts){
            userAccounts.forEach(function(userAccount){
                var userAccountJSON = JSON.parse(JSON.stringify(userAccount));
                userAccountJSON.id = userAccount.id;
                userAccountJSON.role = {};
                if(userAccountJSON.patientProfile){
                    userAccountJSON.role.isPatientProfile = true;
                    userAccountJSON.role.isPhysiotherapist = false;
                    userAccountsJSON.push(userAccountJSON);
                    patientProfilesMap[userAccountJSON.patientProfile] = 1;
                }
                else if(userAccountJSON.physiotherapist){
                    userAccountJSON.role.isPatientProfile = false;
                    userAccountJSON.role.isPhysiotherapist = true;
                    userAccountsJSON.push(userAccountJSON);
                    physiotherapistsMap[userAccountJSON.physiotherapist] = 1;
                }
                console.log('userAccountsJSON:');
                console.log(userAccountsJSON);
            });
            return self.store.findAll('patient-profile', {reload: true});
        }).then(function(patientProfiles){
          patientProfiles.forEach(function(patientProfile){
            var patientProfileJSON = JSON.parse(JSON.stringify(patientProfile));
            patientProfileJSON.id = patientProfile.id;
            patientProfilesMap[patientProfile.id] = patientProfileJSON;
          });
          return self.store.findAll('physiotherapist', {reload: true});
        }).then(function(physiotherapists){
          physiotherapists.forEach(function(physiotherapist){
            var physiotherapistJSON = JSON.parse(JSON.stringify(physiotherapist));
            physiotherapistJSON.id = physiotherapist.id;
            physiotherapistsMap[physiotherapist.id] = physiotherapistJSON;
          });
          for(var i = 0; i < userAccountsJSON.length; i++){
            console.log(i);
            if(userAccountsJSON[i].patientProfile){
              userAccountsJSON[i].patientProfile = patientProfilesMap[userAccountsJSON[i].patientProfile];
            }
            else{
              userAccountsJSON[i].physiotherapist = physiotherapistsMap[userAccountsJSON[i].physiotherapist];
            }
          }
          return userAccountsJSON;
        });
    },
  actions:{
    enableUser: function(ID){
      var self = this;
      var myStore = this.get('store');

      var patientProfile;
      myStore.findRecord('patient-profile', ID, {reload: true})
      .then(function(thePatientProfile){
        patientProfile = thePatientProfile;
        if(patientProfile.get('enabled')){
          console.log('ORIGINALLY ENABLED');
          patientProfile.set('enabled', false);
        }
        else{
          console.log('ORIGINALLY DISABLED');
          patientProfile.set('enabled', true);
        }
        return patientProfile.save({reload: true});
      }).then(function(){
        if(patientProfile.get('enabled')){
          alert('Patient Enabled.');
        }
        else{
          alert('Patient Disabled.');
        }
      });
    },
    enablePhysio: function(ID){
      var self = this;
      var myStore = this.get('store');

      var physiotherapist;
      myStore.findRecord('physiotherapist', ID, {reload: true})
      .then(function(thePhysiotherapist){
        physiotherapist = thePhysiotherapist;
        physiotherapist.set('enabled', !physiotherapist.get('enabled'));
        return physiotherapist.save({reload: true});
      }).then(function(){
        if(physiotherapist.get('enabled')){
          alert('Physiotherapist Enabled.');
        }
        else{
          alert('Physiotherapist Disabled.');
        }
      });
    }
}
});
