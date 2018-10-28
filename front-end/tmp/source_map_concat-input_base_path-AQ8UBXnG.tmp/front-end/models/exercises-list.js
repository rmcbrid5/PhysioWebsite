define('front-end/models/exercises-list', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        rehabilitationPlan: _emberData.default.attr('string'),
        exercise: _emberData.default.attr('string')
    });
});