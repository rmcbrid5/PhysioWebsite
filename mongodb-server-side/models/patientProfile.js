var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// can't delete
var PatientProfileSchema   = new Schema({
    familyName : String,
    givenName : String,
    email : String, // non-modifiable, unique across Administrator, Physiotherapist, and PatientProfile
    userAccount: {type: Schema.ObjectId, ref: 'UserAccount'},    // non-modifiable
    DOB: Date,
    postalCode: String,
    phone: String,
    country: {type: Schema.ObjectId, ref: 'Country'},
    province: {type: Schema.ObjectId, ref: 'Province'},
    city: {type: Schema.ObjectId, ref: 'City'},
    gender: {type: Schema.ObjectId, ref: 'Gender'},
    appointments: [{type: Schema.ObjectId, ref: 'Appointment'}],    // non-modifiable (by patientProfile.js)
    treatments: [{type: Schema.ObjectId, ref: 'Treatment'}], // non-modifiable (by patientProfile.js)
    payments: [{type: Schema.ObjectId, ref: 'Payment'}], // non-modifiable (by patientProfile.js)
    images: [{type: Schema.ObjectId, ref: 'Image'}], // non-modifiable (by patientProfile.js)
    enabled: Boolean
});

module.exports = mongoose.model('PatientProfile', PatientProfileSchema);