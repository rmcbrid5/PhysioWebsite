var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExerciseSchema = new Schema({
    name: String,
    description: String,
    objectives: [String],
    actionSteps: [String],
    frequency: Number,
    duration: Number,
    image: {type: Schema.ObjectId, ref: 'Image'},
    exercisesLists: [{type: Schema.ObjectId, ref: 'ExercisesList'}] // non-modifiable (by exercise.js)
});

module.exports = mongoose.model('ExerciseSchema', ExerciseSchema);