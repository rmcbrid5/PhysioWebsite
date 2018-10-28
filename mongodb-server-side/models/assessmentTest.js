var mongoose     = require('mongoose'); 
var Schema       = mongoose.Schema; 
 
var AssessmentTestSchema   = new Schema ({ 
    name: String, 
    description: String,
    form: {type: Schema.ObjectId, ref: 'Form'}, // non-modifiable
    rehabilitationPlan: {type: Schema.ObjectId, ref: 'RehabilitationPlan'}, // non-modifiable
    recommendations: [{type: Schema.ObjectId, ref: 'Recommendation'}],  // non-modifiable (by assessmentTest.js)
    testResults: [{type: Schema.ObjectId, ref: 'TestResult'}]   // non-modifable (by assessmentTest.js)
});
 
module.exports = mongoose.model('AssessmentTest', AssessmentTestSchema); 