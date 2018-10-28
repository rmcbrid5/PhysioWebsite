define('front-end/models/assessment-test', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        description: _emberData.default.attr('string'),
        form: _emberData.default.attr('string'),
        rehabilitationPlan: _emberData.default.attr('string'),
        recommendations: _emberData.default.attr(),
        testResults: _emberData.default.attr()
    });
});