var mongoose     = require('mongoose'); 
var Schema       = mongoose.Schema; 
 
var QuestionsListSchema   = new Schema ({ 
    form: {type: Schema.ObjectId, ref: 'Form'},
    question: {type: Schema.ObjectId, ref: 'Question'}  // non-modifiable
});  
 
module.exports = mongoose.model('QuestionsList', QuestionsListSchema); 