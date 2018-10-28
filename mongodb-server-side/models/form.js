var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FormSchema = new Schema({
	name: String,
	description: String,
	administrator: {type: mongoose.Schema.ObjectId, ref: 'Administrator'},	// non-modifiable
	assessmentTests: [{type: mongoose.Schema.ObjectId, ref: 'AssessmentTest'}],	// non-modifiable (by form.js)
	injuryForms: [{type: Schema.ObjectId, ref: 'InjuryForm'}],	// non-modifiable (by form.js)
	questionsLists: [{type: Schema.ObjectId, ref: 'QuestionsList'}]		// non-modifiable (by form.js)
});

module.exports = mongoose.model('Form', FormSchema);