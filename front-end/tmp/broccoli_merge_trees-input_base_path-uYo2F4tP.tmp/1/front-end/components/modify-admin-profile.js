define('front-end/components/modify-admin-profile', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        countryModel: Ember.computed(function () {
            return this.get('store').findAll('country');
        }),
        provinceModel: Ember.computed(function () {
            return this.get('store').findAll('province');
        }),
        cityModel: Ember.computed(function () {
            return this.get('store').findAll('city');
        }),
        genderModel: Ember.computed(function () {
            return this.get('store').findAll('gender');
        }),
        profileModel: Ember.computed(function () {
            //patientProfile
            return this.get('store').findAll('patientProfile');
        }),
        userAccountModel: Ember.computed(function () {
            //userAccount
            return this.get('store').findAll('user-account');
        }),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var self = this;
                var obj = this;
                var DS = this.get('DS');
                var admin;
                DS.find('administrator', this.get('ID')).then(function (record) {
                    obj.set('givenName', record.get('givenName'));
                    obj.set('familyName', record.get('familyName'));
                    admin = record;
                });
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('familyName')) {
                            alert('Please enter a Last Name.');
                            return false;
                        }
                        admin.set('givenName', self.get('givenName'));
                        admin.set('familyName', self.get('familyName'));
                        admin.save({ reload: true }).then(function () {
                            alert('Administrator Changes Saved.');
                        });
                    }
                }).modal('show');
            },
            selectDateHired: function selectDateHired(date) {
                this.set('dateHired', date);
            },
            selectDateFinished: function selectDateFinished(date) {
                this.set('dateFinished', date);
            },
            didInsertElement: function didInsertElement() {
                /* Init the table and fire off a call to get the hidden nodes. */
                Ember.$(document).ready(function () {
                    var table = Ember.$('#example').DataTable();
                });
            }
        }
    });
});