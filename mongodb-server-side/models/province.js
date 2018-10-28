var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProvinceSchema   = new Schema({
    name: String,
    patientProfiles: [{type: Schema.ObjectId, ref: 'PatientProfile'}]   // non-modifiable (by province.js)
});

module.exports = mongoose.model('Province', ProvinceSchema);