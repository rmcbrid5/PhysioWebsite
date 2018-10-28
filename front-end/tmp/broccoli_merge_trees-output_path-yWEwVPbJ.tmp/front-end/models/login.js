define('front-end/models/login', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        userAccountName: _emberData.default.attr('string'),
        password: _emberData.default.attr('string'),
        nonce: _emberData.default.attr('string'),
        response: _emberData.default.attr('string'),
        token: _emberData.default.attr('string'),
        requestType: _emberData.default.attr('string'),
        wrongUserAccountName: _emberData.default.attr('boolean'),
        wrongPassword: _emberData.default.attr('boolean'),
        passwordMustChanged: _emberData.default.attr('boolean'),
        passwordReset: _emberData.default.attr('boolean'),
        loginFailed: _emberData.default.attr('boolean'),
        accountIsDisabled: _emberData.default.attr('boolean'),
        sessionIsActive: _emberData.default.attr('boolean')
    });
});