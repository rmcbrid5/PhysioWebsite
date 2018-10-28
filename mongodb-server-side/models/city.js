var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CitySchema   = new Schema({
    name: String,
    patientProfiles: [{type: Schema.ObjectId, ref: 'PatientProfile'}]   // non-modifiable (by city.js)
});

module.exports = mongoose.model('City', CitySchema);