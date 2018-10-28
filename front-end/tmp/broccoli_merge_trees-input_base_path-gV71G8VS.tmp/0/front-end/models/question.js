define('front-end/models/question', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        questionText: _emberData.default.attr('string'),
        helpDescription: _emberData.default.attr('string'),
        questionType: _emberData.default.attr(),
        questionsLists: _emberData.default.attr()
    });
});