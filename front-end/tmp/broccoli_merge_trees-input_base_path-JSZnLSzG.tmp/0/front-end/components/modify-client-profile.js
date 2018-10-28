import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    countryModel: computed(function(){
        return this.get('store').findAll('country');
    }),
    provinceModel: computed(function(){
        return this.get('store').findAll('province');
    }),
    cityModel: computed(function(){
        return this.get('store').findAll('city');
    }),
    genderModel: computed(function(){
        return this.get('store').findAll('gender');
    }),
    postsData: null,
    title: oneWay('postsData.title'),
    body: oneWay('postsData.body'),
    modalName: computed(function(){
        return 'Modify-Posts' + this.get('ID');
    }),
    actions:{
        openModal: function () {
            var self = this;
          var obj = this;
          var DS = this.get('DS');
          var patient;
          DS.find('patient-profile', this.get('ID'))
          .then(function(record){
              obj.set('givenName', record.get('givenName'));
              obj.set('familyName', record.get('familyName'));
              obj.set('postalCode', record.get('postalCode'));
              obj.set('phone', record.get('phone'));
              obj.set('country', record.get('country'));
              obj.set('province', record.get('province'));
              obj.set('city', record.get('city'));
              patient = record;
            });
            $('.ui.' + this.get('modalName') + '.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    if(!self.get('givenName')){
                        alert('Please enter a First Name.');
                        return false;
                    }
                    if(!self.get('familyName')){
                        alert('Please enter a Last Name.');
                        return false;
                    }
                    if(!self.get('country')){
                        alert('Please select a Country.');
                        return false;
                    }
                    if(!self.get('province')){
                        alert('Please select a Province.');
                        return false;
                    }
                    if(!self.get('city')){
                        alert('Please select a City.');
                        return false;
                    }
                    patient.set('givenName', self.get('givenName'));
                    patient.set('familyName', self.get('familyName'));
                    patient.set('postalCode', self.get('postalCode'));
                    patient.set('phone', self.get('phone'));
                    patient.set('country', self.get('country'));
                    patient.set('province', self.get('province'));
                    patient.set('city', self.get('city'));
                    patient.save({reload: true})
                    .then(function(){
                        alert('Client Changes Saved.');
                    });
                }
            }).modal('show');
        },
        selectDateHired: function(date){
            this.set('dateHired', date);
        },
        selectDateFinished: function(date){
            this.set('dateFinished', date);
        },
    didInsertElement: function() {
      /* Init the table and fire off a call to get the hidden nodes. */
      $(document).ready(function() {
          var table = $('#example').DataTable();
        } );
    }
  }
});