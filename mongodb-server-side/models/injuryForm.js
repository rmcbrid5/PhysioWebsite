var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var InjuryFormSchema = mongoose.Schema({
    name: String,
    form: {type: Schema.ObjectId, ref: 'Form'}, // non-modifiable
    completedInjuryForms: [{type: Schema.ObjectId, ref: 'CompletedInjuryForm'}] // non-modifiable (by injuryForm.js)
});
module.exports = mongoose.model('InjuryForm', InjuryFormSchema);