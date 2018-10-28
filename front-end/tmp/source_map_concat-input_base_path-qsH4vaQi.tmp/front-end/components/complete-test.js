define('front-end/components/complete-test', ['exports'], function (exports) {
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
            clicky: function clicky(value) {
                this.set("someAttr", value);
            },

            openModal: function openModal() {
                var self = this;
                var myStore = this.get('store');

                for (var i = 0; i < this.get('assessmentTest').form.questionsLists.length; i++) {
                    this.get('assessmentTest').form.questionsLists[i].unique = 'Answer ' + i.toString();
                }

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        function addTestResults(index) {
                            if (index !== self.get('assessmentTest').form.questionsLists.length) {
                                var newTestResult = myStore.createRecord('test-result', {
                                    question: self.get('assessmentTest').form.questionsLists[index].question.questionText,
                                    answer: self.get('assessmentTest').form.questionsLists[index].unique,
                                    assessmentTest: self.get('assessmentTest').id,
                                    treatment: self.get('treatment').id
                                });
                                return newTestResult.save({ reload: true }).then(function () {
                                    return addTestResults(index + 1);
                                });
                            } else {
                                alert('Assessment Test Complete.');
                            }
                        }
                        addTestResults(0);
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