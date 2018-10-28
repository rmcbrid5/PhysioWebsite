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
            var obj = this;
            var DS = this.get('DS');
            DS.find('patientProfile', this.get('ID'))
            .then(function(record){
                obj.set('patient', record);
                obj.set('givenName', record.get('givenName'));
                obj.set('familyName', record.get('familyName'));
                obj.set('DOB', record.get('DOB'));
                obj.set('postalCode', record.get('postalCode'));
                obj.set('phone', record.get('phone'));
                obj.set('maritalStatus', record.get('maritalStatus'));
                obj.set('occupation', record.get('occupation'));
                return DS.find('country', record.get('country'));
            }).then(function(record){
                obj.set('country', record);
                return DS.find('province', obj.get('patient').get('province'));
            }).then(function(record){
                obj.set('province', record);
                return DS.find('city', obj.get('patient').get('city'));
            }).then(function(record){
                obj.set('city', record);
                return DS.find('gender', obj.get('patient').get('gender'));
            }).then(function(record){
                obj.set('gender', record);
            });
            $('.ui.'+this.get('modalName')+'.modal').modal({
                closable: false,
                transition: 'fade',
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    var patient = this.get('patient');
                    patient.set('givenName', this.get('givenName'));
                    patient.set('familyName', this.get('familyName'));
                    patient.set('postalCode', this.get('postalCode'));
                    patient.set('phone', this.get('phone'));
                    patient.set('maritalStatus', this.get('maritalStatus'));
                    patient.set('occupation', this.get('occupation'));
                    patient.set('country', this.get('country').id);
                    patient.set('province', this.get('province').id);
                    patient.set('city', this.get('city').id);
                    patient.set('gender', this.get('gender').id);
                    patient.set('DOB', this.get('DOB'));
                    patient.save()
                    .then(function(){
                        return true;
                    });
                }
            })
            .modal('show');
        },
        selectDate(date){
            this.set('DOB', date);
        }
      },
      didInsertElement: function() {
        /* Init the table and fire off a call to get the hidden nodes. */
        $(document).ready(function() {
            var table = $('#example').DataTable();
          } );
        }
});
