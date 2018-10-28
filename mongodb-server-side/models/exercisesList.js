var mongoose     = require('mongoose'); 
var Schema       = mongoose.Schema; 
 
var ExercisesListSchema   = new Schema ({
    rehabilitationPlan: {type: Schema.ObjectId, ref: 'RehabilitationPlan'}, // non-modifiable
    exercise: {type: Schema.ObjectId, ref: 'Exercise'}  // non-modifiable
});  
 
module.exports = mongoose.model('ExercisesList', ExercisesListSchema); 