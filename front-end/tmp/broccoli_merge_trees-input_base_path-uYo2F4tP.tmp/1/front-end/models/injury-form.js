define('front-end/models/injury-form', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        form: _emberData.default.attr('string'),
        completedInjuryForms: _emberData.default.attr()
    });
});