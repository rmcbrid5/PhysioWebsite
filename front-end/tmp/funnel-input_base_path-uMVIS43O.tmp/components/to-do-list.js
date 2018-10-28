import Component from '@ember/component';

export default Component.extend({
  store: Ember.inject.service(),
  DS: Ember.inject.service('store'),
  newTask: '',
  state: function() {
    return Ember.isEmpty(this.get('newTask'));
  }.property('newTask'),
  isEditing: false,
  state: function() {
    return Ember.isEmpty(this.get('content').get('task'));
  }.property('model.task'),
  completed: function(key, value) {
    var todo = this.get('model');
    var _this = this;
    if(value === undefined) {
      return todo.get('completed');
    } else {
      todo.set('completed', value);
      todo.save().then(function(){
        if(value) {
          _this.notify.info('task ' + todo.get('task') + ' completed');
        }
      });
      return value;
    }
  }.property('model.completed'),
  actions: {
    editTodo: function() {
      this.set('isEditing', true);
    },
    cancel: function() {
      this.set('isEditing', false);
      this.get('model').rollback();
    },
    updateTodo: function() {
      var todo = this.get('content');
      var _this = this;
      todo.save().then(function(){
        _this.notify.info('todo item updated');
        _this.set('isEditing', false);
      });
    },
    addTodo: function() {
      var DS = this.get('DS');
      var _this = this;
      console.log(_this.get('newTask'));
      var newTask = _this.get('newTask');
      $("ul").append("<li>"+ newTask + "</li>");
      // var todo = DS.createRecord('to-do-list', {
      //   task: _this.get('newTask'),
      //   completed: false
      // });
      // todo.save().then(function() {
      //   _this.set('newTask', '');
      //   _this.notify.success('created new task');
      // });
    },
    removeTodo: function(todo) {
      todo.destroyRecord();
      this.notify.alert('removed task');
    }
  }
});
