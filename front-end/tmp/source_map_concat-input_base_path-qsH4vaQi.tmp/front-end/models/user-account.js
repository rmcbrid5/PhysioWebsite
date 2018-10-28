define('front-end/models/user-account', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        userAccountName: _emberData.default.attr('string'),
        encryptedPassword: _emberData.default.attr('string'),
        administrator: _emberData.default.attr('string'),
        physiotherapist: _emberData.default.attr('string'),
        patientProfile: _emberData.default.attr('string'),
        encryptedAuth: _emberData.default.attr('string'),
        authenticationCode: _emberData.default.attr('string'),
        passwordMustChanged: _emberData.default.attr('boolean'),
        salt: _emberData.default.attr('string')
    });
});