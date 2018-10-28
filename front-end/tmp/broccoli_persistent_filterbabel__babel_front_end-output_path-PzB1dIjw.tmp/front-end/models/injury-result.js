define('front-end/models/injury-result', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        questionText: _emberData.default.attr('string'),
        answer: _emberData.default.attr('string'),
        completedInjuryForm: _emberData.default.attr('string')
    });
});