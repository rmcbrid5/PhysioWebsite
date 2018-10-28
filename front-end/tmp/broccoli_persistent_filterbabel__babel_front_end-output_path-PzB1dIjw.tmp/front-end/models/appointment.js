define('front-end/models/appointment', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        date: _emberData.default.attr('date'),
        reason: _emberData.default.attr('string'),
        other: _emberData.default.attr('string'),
        patientProfile: _emberData.default.attr('string')
    });
});