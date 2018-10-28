define('front-end/models/completed-injury-form', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        email: _emberData.default.attr('string'),
        date: _emberData.default.attr('date'),
        injuryForm: _emberData.default.attr('string'),
        injuryResults: _emberData.default.attr()
    });
});