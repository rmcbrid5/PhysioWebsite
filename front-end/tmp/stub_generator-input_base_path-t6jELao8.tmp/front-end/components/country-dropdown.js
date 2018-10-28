define('front-end/components/country-dropdown', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        countryModel: Ember.computed(function () {
            return this.get('store').findAll('country');
        })
    });
});