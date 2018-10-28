define('front-end/models/self-start-user', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        familyName: _emberData.default.attr('string'),
        givenName: _emberData.default.attr('string'),
        email: _emberData.default.attr('string'),
        userAccount: _emberData.default.attr('string')
    });
});