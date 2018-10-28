import DS from 'ember-data';

export default DS.Model.extend({
    userAccountName: DS.attr('string'),
    encryptedPassword: DS.attr('string'),
    administrator: DS.attr('string'),
    physiotherapist: DS.attr('string'),
    patientProfile: DS.attr('string'),
    encryptedAuth: DS.attr('string'),
    authenticationCode: DS.attr('string'),
    passwordMustChanged: DS.attr('boolean'),
    salt: DS.attr('string')
});