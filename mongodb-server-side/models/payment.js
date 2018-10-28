var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    dayTimeStamp: Date,
    amount: Number,
    note: String,
    patientProfile: {type: Schema.ObjectId, ref: 'PatientProfile'}  // non-modifiable
});

module.exports = mongoose.model('Payment', PaymentSchema);