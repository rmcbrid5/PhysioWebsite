define('front-end/models/questions-list', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        form: _emberData.default.attr('string'),
        question: _emberData.default.attr('string')
    });
});