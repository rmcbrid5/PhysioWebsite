define('front-end/components/delete-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        DS: Ember.inject.service('store'),
        modalName: Ember.computed(function () {
            return 'Delete-Plans' + this.get('ID');
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
                        _this.get('DS').find('form', _this.get('ID'), { reload: true }).then(function (post) {
                            post.destroyRecord().then(function () {
                                return true;
                            });
                        });
                    }
                }).modal('show');
            }
        }
    });
});