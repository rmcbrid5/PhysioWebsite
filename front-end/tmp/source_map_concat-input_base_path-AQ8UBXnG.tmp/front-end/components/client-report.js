define('front-end/components/client-report', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        questionModel: Ember.computed(function () {
            return this.get('store').findAll('question');
        }),
        assessmentTestModel: Ember.computed(function () {
            return this.get('store').findAll('assessment-test');
        }),
        profileModel: Ember.computed(function () {
            return this.get('store').findAll('patientProfile');
            //fix to work wit fname/lname
        }),

        pairModel: [],
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Client-Report' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        _this.get('DS').find('form', _this.get('form').id).then(function (form) {
                            //fix these - new model with fname and lname passes etc. (passed in forms.hbs)
                            form.set('name', _this.get('name'));
                            form.set('description', _this.get('description'));
                            form.set('administrator', _this.get('administrator'));
                            form.set('assessmentTests', _this.get('assessmentTests'));
                            form.set('questions', _this.get('questions'));
                            form.save().then(function () {
                                return true;
                            });
                        });
                    }
                }).modal('show');
            }
        },
        didInsertElement: function didInsertElement() {
            /* Init the table and fire off a call to get the hidden nodes. */
            $(document).ready(function () {
                var table = $('#example').DataTable();
            });
        }
    });
});