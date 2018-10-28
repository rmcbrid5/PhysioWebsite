define('front-end/models/rehabilitation-plan', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        description: _emberData.default.attr('string'),
        physiotherapist: _emberData.default.attr('string'),
        goal: _emberData.default.attr('string'),
        exercisesLists: _emberData.default.attr(),
        assessmentTests: _emberData.default.attr(),
        treatments: _emberData.default.attr()
    });
});