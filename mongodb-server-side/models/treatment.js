var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TreatmentSchema = new Schema({
    dateAssigned: Date,
    physiotherapist: {type:  Schema.ObjectId, ref: 'Physiotherapist'},  // non-modifiable
    rehabilitationPlan: {type: Schema.ObjectId, ref: 'RehabilitationPlan'}, // non-modifiable
    patientProfile: {type: Schema.ObjectId, ref: 'PatientProfile'}, // non-modifiable
    recommendations: [{type: Schema.ObjectId, ref: 'Recommendation'}],   // non-modifiable (by treatment.js)
    testResults: [{type: Schema.ObjectId, ref: 'TestResult'}]   // non-modifiable (by treatment.js)
});

module.exports = mongoose.model('TreatmentSchema', TreatmentSchema);