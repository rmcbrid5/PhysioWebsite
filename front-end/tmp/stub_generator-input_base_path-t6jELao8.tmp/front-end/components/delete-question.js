define('front-end/components/delete-question', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        DS: Ember.inject.service('store'),
        modalName: Ember.computed(function () {
            return 'Delete-Questions' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        _this.get('DS').find('question', _this.get('ID'), { reload: true }).then(function (question) {
                            return question.destroyRecord();
                        });
                        return true;
                    }
                }).modal('show');
            }
        }
    });
});