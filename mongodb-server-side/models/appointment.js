var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AppointmentSchema   = new Schema({
    date: Date,
    reason: String,
    other: String,
    patientProfile: {type: Schema.ObjectId, ref: 'PatientProfile'}  // non-modifiable
});

module.exports = mongoose.model('Appointment', AppointmentSchema);