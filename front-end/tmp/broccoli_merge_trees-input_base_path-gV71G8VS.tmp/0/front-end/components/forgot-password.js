define('front-end/components/forgot-password', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        actions: {
            openModal: function openModal() {
                var _this = this;

                var self = this;
                var myStore = this.get('store');

                this.set('sent', false);
                this.set('userAccountName', '');
                this.set('newPassword', '');
                this.set('confirmPassword', '');
                this.set('authenticationCode', '');

                var userAccount;
                Ember.$('.ui.changePassword.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!_this.get('sent')) {
                            console.log('1');
                            if (!_this.get('userAccountName')) {
                                alert('Please enter a User Account Name.');
                                return false;
                            }
                            if (!_this.get('newPassword') || _this.get('newPassword') !== _this.get('confirmPassword')) {
                                alert('Please enter 2 matching passwords.');
                                return false;
                            }
                            myStore.findAll('userAccount', { reload: true }).then(function (userAccounts) {
                                console.log('2');
                                userAccounts.forEach(function (theUserAccount) {
                                    console.log(theUserAccount.get('userAccountName'));
                                    if (theUserAccount.get('userAccountName') === self.get('userAccountName').toLowerCase()) {
                                        console.log('4');
                                        userAccount = theUserAccount;
                                        return;
                                    }
                                });
                                if (!userAccount) {
                                    throw new Error('Invalid User Account Name.');
                                }
                                return myStore.findRecord('userAccount', userAccount.id, { reload: true });
                            }).then(function (theUserAccount) {
                                theUserAccount.set('passwordMustChanged', true);
                                return theUserAccount.save({ reload: true });
                            }).then(function () {
                                console.log('5');
                                self.set('sent', true);
                                self.notifyPropertyChange('set');
                                return false;
                            }).catch(function (err) {
                                alert(err);
                                return false;
                            });

                            return false;
                        } else {
                            userAccount.set('passwordMustChanged', false);
                            userAccount.set('authenticationCode', self.get('authenticationCode'));
                            userAccount.set('encryptedPassword', self.get('oudaAuth').hash(self.get('newPassword')));
                            userAccount.save({ reload: true }).then(function () {
                                return myStore.findRecord('userAccount', userAccount.id, { reload: true });
                            }).then(function (theUserAccount) {
                                if (theUserAccount.get('authenticationCode')) {
                                    alert('Incorrect authentication code.');
                                } else {
                                    alert('Password successfully changed!');
                                }
                            }).catch(function (err) {
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
});