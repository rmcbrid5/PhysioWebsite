var mongoose     = require('mongoose'); 
var Schema       = mongoose.Schema; 
 
var RecommendationSchema   = new Schema ({ 
    timeStamp: Date, 
    decision: String,
    assessmentTest: {type: mongoose.Schema.ObjectId, ref: 'AssessmentTest'},    // non-modifiable
    treatment: {type: mongoose.Schema.ObjectId, ref: 'Treatment'}   // non-modifiable
});  
 
module.exports = mongoose.model('Recommendation', RecommendationSchema); 