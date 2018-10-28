var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ToDoListSchema   = new Schema ({
task: String,
completed: Boolean
});

module.exports = mongoose.model('ToDoList', ToDoListSchema);