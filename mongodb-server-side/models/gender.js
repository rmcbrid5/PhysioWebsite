var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GenderSchema   = new Schema({
    name: String,
    patientProfiles: [{type: Schema.ObjectId, ref: 'PatientProfile'}]   // non-modifiable (by gender.js)
});

module.exports = mongoose.model('Gender', GenderSchema);