
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionTypeSchema = new Schema({
	name: String,
	questions: [{type: Schema.ObjectId, ref: 'Question'}]	// non-modifiable (by questionType.js)
});

module.exports = mongoose.model('QuestionType', QuestionTypeSchema);