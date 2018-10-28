var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// can't delete
var UserAccountSchema = new Schema({
    userAccountName: String,    // non-modifiable, unique across UserAccount
    encryptedPassword: String,
    salt: String,
    userAccountExpiryDate: Date,
    passwordMustChanged: Boolean,
    passwordReset: Boolean,
    administrator: {type: Schema.ObjectId, ref: 'Administrator'},   // non-modifiable
    physiotherapist: {type: Schema.ObjectId, ref: 'Physiotherapist'},   // non-modifiable
    patientProfile: {type: Schema.ObjectId, ref: 'PatientProfile'}, // non-modifiable,
    authenticationCode: String
});

module.exports = mongoose.model('UserAccount', UserAccountSchema);