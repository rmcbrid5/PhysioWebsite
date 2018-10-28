var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CompletedInjuryFormSchema = mongoose.Schema({
    email: String,
    date: Date, // non-modifiable
    injuryForm: {type: Schema.ObjectId, ref: 'InjuryForm'}, // non-modifiable
    injuryResults: [{type: Schema.ObjectId, ref: 'InjuryResult'}]   // non-modifiable (from completedInjuryForm.js)
});
module.exports = mongoose.model('CompletedInjuryForm', CompletedInjuryFormSchema);