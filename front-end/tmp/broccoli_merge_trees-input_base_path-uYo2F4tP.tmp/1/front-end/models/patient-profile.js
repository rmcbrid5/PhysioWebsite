define('front-end/models/patient-profile', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        familyName: _emberData.default.attr('string'),
        givenName: _emberData.default.attr('string'),
        email: _emberData.default.attr('string'),
        userAccount: _emberData.default.attr('string'),
        DOB: _emberData.default.attr('date'),
        postalCode: _emberData.default.attr('string'),
        phone: _emberData.default.attr('string'),
        country: _emberData.default.attr('string'),
        province: _emberData.default.attr('string'),
        city: _emberData.default.attr('string'),
        gender: _emberData.default.attr('string'),
        appointments: _emberData.default.attr(),
        treatments: _emberData.default.attr(),
        payments: _emberData.default.attr(),
        images: _emberData.default.attr(),
        enabled: _emberData.default.attr('boolean')
    });
});