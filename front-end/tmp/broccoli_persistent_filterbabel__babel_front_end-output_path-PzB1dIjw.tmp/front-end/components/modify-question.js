define('front-end/components/modify-question', ['exports'], function (exports) {
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
            return 'Modify-Question' + this.get('ID');
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
                        if (!_this.get('questionText')) {
                            alert('Please enter Question Text.');
                            return false;
                        }
                        if (!_this.get('helpDescription')) {
                            alert('Please enter a Help Description.');
                            return false;
                        }
                        var self = _this;
                        var myStore = self.get('store');

                        myStore.find('question', _this.get('ID')).then(function (question) {
                            question.set('questionText', self.get('questionText'));
                            question.set('helpDescription', self.get('helpDescription'));
                            return question.save();
                        }).then(function () {
                            alert('Question saved.');
                        });
                        return true;
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