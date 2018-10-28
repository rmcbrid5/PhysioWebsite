var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
	questionText: String,
	helpDescription: String,
	questionType: {type: Schema.ObjectId, ref: 'QuestionType'},	// non-modifiable
	questionsLists: [{type: Schema.ObjectId, ref: 'QuestionsList'}]	// non-modifiable (by question.js)
});

module.exports = mongoose.model('Question', QuestionSchema);