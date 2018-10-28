var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TestResultSchema   = new Schema ({
    question: String,
    answer: String,
    assessmentTest: {type: mongoose.Schema.ObjectId, ref: 'AssessmentTest'}, // non-modifiable
    treatment: {type: Schema.ObjectId, ref: 'Treatment'}    // non-modifiable
});

module.exports = mongoose.model('TestResult', TestResultSchema);