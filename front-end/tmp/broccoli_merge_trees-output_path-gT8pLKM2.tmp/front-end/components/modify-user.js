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
            $('.ui.' + this.get('modalName') + '.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    return false;
                }
            }).modal('show');
        },   
        selectDateHired: function(date){
            this.set('dateHired', date);
        },
        selectDateFinished: function(date){
            this.set('dateFinished', date);
        }
    },
    didInsertElement: function() {
      /* Init the table and fire off a call to get the hidden nodes. */
      $(document).ready(function() {
          var table = $('#example').DataTable();
        } );
    }
});