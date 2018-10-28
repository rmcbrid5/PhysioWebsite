import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    actions: {
        openModal: function () {
            var self = this;
            var myStore = this.get('store');

            this.set('sent', false);
            this.set('userAccountName', '');
            this.set('newPassword', '');
            this.set('confirmPassword', '');
            this.set('authenticationCode', '');

            var userAccount;
            $('.ui.changePassword.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    if(!this.get('sent')){
                        console.log('1');
                        if(!this.get('userAccountName')){
                            alert('Please enter a User Account Name.');
                            return false;
                        }
                        if(!this.get('newPassword') || this.get('newPassword') !== this.get('confirmPassword')){
                            alert('Please enter 2 matching passwords.');
                            return false;
                        }
                        myStore.findAll('userAccount', {reload: true})
                        .then(function(userAccounts){
                            console.log('2');
                            userAccounts.forEach(function(theUserAccount){
                                console.log(theUserAccount.get('userAccountName'));
                                if(theUserAccount.get('userAccountName') === self.get('userAccountName').toLowerCase()){
                                    console.log('4');
                                    userAccount = theUserAccount;
                                    return;
                                }
                            });
                            if(!userAccount){
                                throw new Error('Invalid User Account Name.');
                            }
                            return myStore.findRecord('userAccount', userAccount.id , {reload: true});
                        }).then(function(theUserAccount){
                            theUserAccount.set('passwordMustChanged', true);
                            return theUserAccount.save({reload: true});
                        }).then(function(){
                            console.log('5');
                            self.set('sent', true);
                            self.notifyPropertyChange('set');
                            return false;
                        }).catch(function(err){
                            alert(err);
                            return false;
                        });

                        return false;
                    }
                    else{
                        userAccount.set('passwordMustChanged', false);
                        userAccount.set('authenticationCode', self.get('authenticationCode'));
                        userAccount.set('encryptedPassword', self.get('oudaAuth').hash(self.get('newPassword')));
                        userAccount.save({reload: true})
                        .then(function(){
                            return myStore.findRecord('userAccount', userAccount.id, {reload: true});
                        }).then(function(theUserAccount){
                            if(theUserAccount.get('authenticationCode')){
                                alert('Incorrect authentication code.');
                            }
                            else{
                                alert('Password successfully changed!');
                            }
                        }).catch(function(err){
                            alert(err);
                            return false;
                        });
                        return false;
                    }
                }
            }).modal('show');
        }
    }
});
