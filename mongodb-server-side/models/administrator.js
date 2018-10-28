/*
Segment done by Kevin Freeman 
kfreem4@uwo.ca
*/

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// can't delete
var AdministratorSchema   = new Schema({
    familyName : String,
    givenName : String,
    email : String, // non-modifiable, unique across Administrator, Physiotherapist, and PatientProfile
    userAccount: {type: Schema.ObjectId, ref: 'UserAccount'},    // non-modifiable
    dateHired: Date,
    dateFinished: Date,
    forms: [{type: Schema.ObjectId, ref: 'Form'}], // non-modifiable (by administrator.js)
    enabled: Boolean
});

module.exports = mongoose.model('Administrator', AdministratorSchema);