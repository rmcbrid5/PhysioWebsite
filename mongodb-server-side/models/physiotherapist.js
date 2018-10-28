var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhysiotherapistSchema = new Schema({
    familyName: String,
    givenName: String,
    email: String,
    dateHired: Date,
    dateFinished: Date,
    enabled: Boolean,
    treatments: [{type: Schema.ObjectId, ref: 'Treatment'}],
    rehabilitationPlans: [{type: Schema.ObjectId, ref: 'RehabilitationPlan'}],
    userAccount: {type: Schema.ObjectId, ref: 'UserAccount'}
});

module.exports = mongoose.model('Physiotherapist', PhysiotherapistSchema);