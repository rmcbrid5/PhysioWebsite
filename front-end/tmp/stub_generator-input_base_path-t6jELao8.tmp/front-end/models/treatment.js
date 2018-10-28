define('front-end/models/treatment', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        dateAssigned: _emberData.default.attr('string'),
        physiotherapist: _emberData.default.attr('string'),
        rehabilitationPlan: _emberData.default.attr('string'),
        patientProfile: _emberData.default.attr('string'),
        recommendations: _emberData.default.attr(),
        testResutls: _emberData.default.attr()
    });
});