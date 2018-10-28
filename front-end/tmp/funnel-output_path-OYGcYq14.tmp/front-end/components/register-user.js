import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    genderModel: computed(function(){
        return this.get('store').findAll('gender');
    }),
    countryModel: computed(function(){
        return this.get('store').findAll('country');
    }),
    provinceModel: computed(function(){
        return this.get('store').findAll('province');
    }),
    cityModel: computed(function(){
        return this.get('store').findAll('city');
    }),
    actions:{
        openModal: function () {
            var self = this;
            var myStore = this.get('store');
            var authentication = self.get('oudaAuth');

            self.set('DOB', null);
            self.set('postalCode', null);
            self.set('phone', null);
            self.set('maritalStatus', null);
            self.set('occupation', null);
            self.set('others', null);
            self.set('country', null);
            self.set('province', null);
            self.set('city', null);
            self.set('gender', null);
            self.set('familyName', null);
            self.set('givenName', null);
            self.set('email1', null);
            self.set('email2', null);
            self.set('userAccountName', null);
            self.set('password1', null);
            self.set('password2', null);

            var newPatientProfile;

            $('.ui.registerUser.modal').modal({
                closable: false,
                onDeny: function(){
                    return true;
                },
                onApprove: function(){
                    if(!self.get('email1') || !self.get('email2')){
                        alert('Please enter two matching Emails.');
                        return false;
                    }

                    self.set('email1', self.get('email1').toLowerCase());
                    self.set('email2', self.get('email2').toLowerCase());

                    if(self.get('email1') !== self.get('email2')){
                        alert('Please enter two matching Emails.');
                        return false;
                    }
                    if(!self.get('password1') || self.get('password1') !== self.get('password2')){
                        alert('Please enter two matching Passwords.');
                        return false;
                    }
                    if(!self.get('userAccountName')){
                        alert('Please enter a User Account Name.');
                        return false;
                    }
                    self.set('userAccountName', self.get('userAccountName').toLowerCase());
                    if(!self.get('givenName')){
                        alert('Please enter a First Name.');
                        return false;
                    }
                    if(!self.get('phone')){
                        alert('Please enter a Phone Number.');
                        return false;
                    }
                    if(!self.get('givenName')){
                        alert('Please enter a First Name.');
                        return false;
                    }
                    if(!self.get('familyName')){
                        alert('Please enter a Last Name.');
                        return false;
                    }
                    if(!self.get('gender')){
                        alert('Please select a Gender.');
                        return false;
                    }
                    if(!self.get('DOB')){
                        alert('Please select a Date of Birth.');
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

                    return myStore.findAll('patientProfile', {reload: true})
                    .then(function(patientProfiles){
                        patientProfiles.forEach(function(patientProfile){
                            if(patientProfile.get('email').toLowerCase() === self.get('email1').toLowerCase()){
                                alert('That Email is already taken.');
                                throw new Error('That Email is already taken.');
                            }
                        });
                        return myStore.findAll('physiotherapist', {reload: true});
                    }).then(function(physiotherapists){
                        physiotherapists.forEach(function(physiotherapist){
                            if(physiotherapist.get('email').toLowerCase() === self.get('email1').toLowerCase()){
                                alert('That Email is already taken.');
                                throw new Error('That Email is already taken.');
                            }
                        });
                        return myStore.findAll('administrator', {reload: true});
                    }).then(function(administrators){
                        administrators.forEach(function(administrator){
                            if(administrator.get('email').toLowerCase() === self.get('email1').toLowerCase()){
                                alert('That Email is already taken.');
                                throw new Error('That Email is already taken.');
                            }
                        });
                        return myStore.findAll('userAccount', {reload: true});
                    }).then(function(userAccounts){
                        userAccounts.forEach(function(userAccount){
                            if(userAccount.get('userAccountName').toLowerCase() === self.get('userAccountName').toLowerCase()){
                                alert('That User Account Name is already taken.');
                                throw new Error('That User Account Name is already taken.');
                            }
                        });
                        newPatientProfile = myStore.createRecord('patientProfile', {
                            familyName: self.get('familyName'),
                            givenName: self.get('givenName'),
                            email: self.get('email1'),
                            DOB: self.get('DOB'),
                            phone: self.get('phone'),
                            gender: self.get('gender'),
                            country: self.get('country'),
                            province: self.get('province'),
                            city: self.get('city'),
                            postalCode: self.get('postalCode'),
                            maritalStatus: self.get('maritalStatus'),
                            occupation: self.get('occupation')
                        });
                        return newPatientProfile.save({reload: true});
                    }).then(function(){
                        var newUserAccount = myStore.createRecord('userAccount', {
                            userAccountName: self.get('userAccountName'),
                            encryptedPassword: authentication.hash(self.get('password1')),
                            patientProfile: newPatientProfile.id
                        });
                        return newUserAccount.save({reload: true});
                    }).then(function(){
                        alert('Patient Profile Created.');
                    }).catch(function(err){
                        console.log(err);
                    });
                }
            }).modal('show');
        },
        selectDate: function(date){
            this.set('DOB', date);
        }
    }
});