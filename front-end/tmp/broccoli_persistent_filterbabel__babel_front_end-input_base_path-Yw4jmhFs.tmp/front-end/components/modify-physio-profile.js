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
    profileModel: computed(function(){  //patientProfile
        return this.get('store').findAll('patientProfile');
    }),
    userAccountModel: computed(function(){ //userAccount
        return this.get('store').findAll('user-account');
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
          var physio;
          DS.find('physiotherapist', this.get('ID'))
          .then(function(record){
              obj.set('givenName', record.get('givenName'));
              obj.set('familyName', record.get('familyName'));
              obj.set('dateFinished', record.get('dateFinished'));
              physio = record;
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
                    physio.set('givenName', self.get('givenName'));
                    physio.set('familyName', self.get('familyName'));
                    physio.set('dateFinished', self.get('dateFinished'));
                    physio.save({reload: true})
                    .then(function(){
                        alert('Physiotherapist Changes Saved.');
                    });
                }
            }).modal('show');

        },
        selectDateFinished: function(date){
            this.set('dateFinished', date);
        },
    didInsertElement: function() {
      /* Init the table and fire off a call to get the hidden nodes. */
      $(document).ready(function() {
          var table = $('#example').DataTable();
        } );
      },
    disableAccount: function() {
      DS.find('physiotherapist', this.get('ID'))
      .then(function(record){
        //record._internalModel._data.isDisabled = true;
        //console.log(record);
      });
    }
  }
});
