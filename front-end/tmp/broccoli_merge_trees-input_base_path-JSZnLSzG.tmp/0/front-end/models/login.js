import DS from 'ember-data';

export default DS.Model.extend({
    userAccountName: DS.attr('string'),
    password: DS.attr('string'),
    nonce: DS.attr('string'),
    response: DS.attr('string'),
    token: DS.attr('string'),
    requestType: DS.attr('string'),
    wrongUserAccountName: DS.attr('boolean'),
    wrongPassword: DS.attr('boolean'),
    passwordMustChanged: DS.attr('boolean'),
    passwordReset: DS.attr('boolean'),
    loginFailed: DS.attr('boolean'),
    accountIsDisabled: DS.attr('boolean'),
    sessionIsActive: DS.attr('boolean')
});
