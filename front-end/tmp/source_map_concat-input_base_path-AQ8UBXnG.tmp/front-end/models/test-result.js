define('front-end/models/test-result', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        question: _emberData.default.attr('string'),
        answer: _emberData.default.attr('string'),
        assessmentTest: _emberData.default.attr('string'),
        treatment: _emberData.default.attr('string')
    });
});