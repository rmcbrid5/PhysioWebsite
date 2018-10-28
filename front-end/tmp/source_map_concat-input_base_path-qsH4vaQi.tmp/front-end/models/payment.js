define('front-end/models/payment', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        dayTimeStamp: _emberData.default.attr('date'),
        amount: _emberData.default.attr('number'),
        note: _emberData.default.attr('string'),
        patientProfile: _emberData.default.attr('string')
    });
});