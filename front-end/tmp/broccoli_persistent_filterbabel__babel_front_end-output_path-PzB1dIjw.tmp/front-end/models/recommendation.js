define('front-end/models/recommendation', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        timeStamp: _emberData.default.attr('date'),
        decision: _emberData.default.attr('string'),
        assessmentTest: _emberData.default.attr('string'),
        treatment: _emberData.default.attr('string')
    });
});