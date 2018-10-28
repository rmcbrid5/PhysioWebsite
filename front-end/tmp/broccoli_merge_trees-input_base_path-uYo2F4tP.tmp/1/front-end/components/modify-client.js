define('front-end/components/modify-client', ['exports'], function (exports) {
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
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                var obj = this;
                var DS = this.get('DS');
                DS.find('patientProfile', this.get('ID')).then(function (record) {
                    obj.set('patient', record);
                    obj.set('givenName', record.get('givenName'));
                    obj.set('familyName', record.get('familyName'));
                    obj.set('DOB', record.get('DOB'));
                    obj.set('postalCode', record.get('postalCode'));
                    obj.set('phone', record.get('phone'));
                    obj.set('maritalStatus', record.get('maritalStatus'));
                    obj.set('occupation', record.get('occupation'));
                    return DS.find('country', record.get('country'));
                }).then(function (record) {
                    obj.set('country', record);
                    return DS.find('province', obj.get('patient').get('province'));
                }).then(function (record) {
                    obj.set('province', record);
                    return DS.find('city', obj.get('patient').get('city'));
                }).then(function (record) {
                    obj.set('city', record);
                    return DS.find('gender', obj.get('patient').get('gender'));
                }).then(function (record) {
                    obj.set('gender', record);
                });
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var patient = _this.get('patient');
                        patient.set('givenName', _this.get('givenName'));
                        patient.set('familyName', _this.get('familyName'));
                        patient.set('postalCode', _this.get('postalCode'));
                        patient.set('phone', _this.get('phone'));
                        patient.set('maritalStatus', _this.get('maritalStatus'));
                        patient.set('occupation', _this.get('occupation'));
                        patient.set('country', _this.get('country').id);
                        patient.set('province', _this.get('province').id);
                        patient.set('city', _this.get('city').id);
                        patient.set('gender', _this.get('gender').id);
                        patient.set('DOB', _this.get('DOB'));
                        patient.save().then(function () {
                            return true;
                        });
                    }
                }).modal('show');
            },
            selectDate: function selectDate(date) {
                this.set('DOB', date);
            }
        },
        didInsertElement: function didInsertElement() {
            /* Init the table and fire off a call to get the hidden nodes. */
            Ember.$(document).ready(function () {
                var table = Ember.$('#example').DataTable();
            });
        }
    });
});