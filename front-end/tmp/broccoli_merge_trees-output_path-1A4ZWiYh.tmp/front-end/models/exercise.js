define('front-end/models/exercise', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        description: _emberData.default.attr('string'),
        objectives: _emberData.default.attr(),
        actionSteps: _emberData.default.attr(),
        frequency: _emberData.default.attr('number'),
        duration: _emberData.default.attr('number'),
        exercisesLists: _emberData.default.attr(),
        image: _emberData.default.attr('string')
    });
});