define('front-end/components/question-dropdown', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        questionsModel: Ember.computed(function () {
            return this.get('store').findAll('question');
        })
    });
});