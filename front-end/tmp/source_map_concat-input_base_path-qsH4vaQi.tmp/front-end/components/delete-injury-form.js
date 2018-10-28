define('front-end/components/delete-injury-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        modalName: Ember.computed(function () {
            return 'Delete-Injury-Forms' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                var myStore = this.get('store');
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        myStore.findRecord('injuryForm', _this.get('ID'), { reload: true }).then(function (injuryForm) {
                            injuryForm.destroyRecord().then(function () {
                                alert('Injury Form deleted.');
                            });
                        });
                    }
                }).modal('show');
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