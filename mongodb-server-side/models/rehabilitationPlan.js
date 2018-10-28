var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RehabilitationPlanSchema = new Schema({
    name: String,
    description: String,
    physiotherapist: {type: Schema.ObjectId, ref: 'Physiotherapist'},   // non-modifiable
    goal: String,
    exercisesLists: [{type: Schema.ObjectId, ref: 'ExercisesLists'}],   // non-modifiable (by rehabilitationPlan.js)
    assessmentTests: [{type: Schema.ObjectId, ref: 'AssessmentTest'}],  // non-modifiable (by rehabilitationPlan.js)
    treatments: [{type: Schema.ObjectId, ref: 'Treatment'}] // non-modifiable (by rehabilitationPlan.js)
});

module.exports = mongoose.model('RehabilitationPlanSchema', RehabilitationPlanSchema);