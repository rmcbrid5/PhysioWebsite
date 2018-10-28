var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var InjuryResultSchema = mongoose.Schema({
    questionText: String,
    answer: String,
    completedInjuryForm: {type: Schema.ObjectId, ref: 'CompletedInjuryForm'}
});
module.exports = mongoose.model('InjuryResult', InjuryResultSchema);