define('front-end/components/show-injury-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Assesment-Test' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var self = this;
                var myStore = this.get('store');

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        return true;
                    }

                }).modal('show');
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