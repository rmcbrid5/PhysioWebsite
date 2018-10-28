var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CountrySchema = new Schema({
    name: String,
    patientProfiles: [{type: Schema.ObjectId, ref: 'PatientProfile'}]   // non-modifiable (by country.js)
});

module.exports = mongoose.model('Country', CountrySchema);