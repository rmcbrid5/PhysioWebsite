define('front-end/components/add-question', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        questionTypeModel: Ember.computed(function () {
            return this.get('store').findAll('question-type');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                this.set('questionText', null);
                this.set('helpDescription', null);
                this.set('questionType', null);
                Ember.$('.ui.newQuestion.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var self = _this;
                        var myStore = _this.get('store');

                        if (!self.get('questionText')) {
                            alert('Please enter Question Text.');
                            return false;
                        }
                        if (!self.get('helpDescription')) {
                            alert('Please enter a Help Description.');
                            return false;
                        }
                        if (!self.get('questionType')) {
                            alert('Please select a Question Type.');
                            return false;
                        }
                        var newQuestion = myStore.createRecord('question', {
                            questionText: self.get('questionText'),
                            helpDescription: self.get('helpDescription'),
                            questionType: self.get('questionType')
                        });
                        newQuestion.save().then(function () {
                            alert('Question created.');
                        });
                        return true;
                    }
                }).modal('show');
            }
        }
    });
});