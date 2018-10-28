define('front-end/components/add-injury-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        formModel: Ember.computed(function () {
            return this.get('store').findAll('form');
        }),

        actions: {
            openModal: function openModal() {
                var _this = this;

                this.set('name', null);
                this.set('form', null);
                Ember.$('.ui.newInjuryForm.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var newPost = _this.get('store').createRecord('injury-form', {
                            name: _this.get('name'),
                            form: _this.get('form').id
                        });
                        newPost.save().then(function () {
                            alert('saved.');
                        });
                        return true;
                    }
                }).modal('show');
            }
        }
    });
});