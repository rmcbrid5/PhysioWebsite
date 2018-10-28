var mongoose = require('mongoose');
var LoginSchema = mongoose.Schema({
    userAccountName: String,
    password: String,
    nonce: String,
    response: String,
    token: String,
    requestType: String,
    wrongUserAccountName: Boolean,
    wrongPassword: Boolean,
    passwordMustChanged: Boolean,
    passwordReset: Boolean,
    loginFailed: Boolean,
    accountIsDisabled: Boolean,
    sessionIsActive: Boolean
});

module.exports = mongoose.model('Login', LoginSchema);