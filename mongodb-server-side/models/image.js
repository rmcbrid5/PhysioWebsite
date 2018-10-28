var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var imagesSchema = mongoose.Schema({
    name: String,
    type: String,
    size: String,
    rawSize: Number,
    imageData: String,
    patientProfile: { type: Schema.ObjectId, ref: 'PatientProfile' },    // non-modifiable
    exercise: {type: Schema.ObjectId, ref: 'Exercise'}  // non-modifiable
});
module.exports = mongoose.model('Image', imagesSchema);