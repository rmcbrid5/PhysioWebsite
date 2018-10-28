define('front-end/components/to-do-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _EmberComponent$exte;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  exports.default = Ember.Component.extend((_EmberComponent$exte = {
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    newTask: '',
    state: function () {
      return Ember.isEmpty(this.get('newTask'));
    }.property('newTask'),
    isEditing: false
  }, _defineProperty(_EmberComponent$exte, 'state', function () {
    return Ember.isEmpty(this.get('content').get('task'));
  }.property('model.task')), _defineProperty(_EmberComponent$exte, 'completed', function (key, value) {
    var todo = this.get('model');
    var _this = this;
    if (value === undefined) {
      return todo.get('completed');
    } else {
      todo.set('completed', value);
      todo.save().then(function () {
        if (value) {
          _this.notify.info('task ' + todo.get('task') + ' completed');
        }
      });
      return value;
    }
  }.property('model.completed')), _defineProperty(_EmberComponent$exte, 'actions', {
    editTodo: function editTodo() {
      this.set('isEditing', true);
    },
    cancel: function cancel() {
      this.set('isEditing', false);
      this.get('model').rollback();
    },
    updateTodo: function updateTodo() {
      var todo = this.get('content');
      var _this = this;
      todo.save().then(function () {
        _this.notify.info('todo item updated');
        _this.set('isEditing', false);
      });
    },
    addTodo: function addTodo() {
      var DS = this.get('DS');
      var _this = this;
      console.log(_this.get('newTask'));
      var newTask = _this.get('newTask');
      $("ul").append("<li>" + newTask + "</li>");
      // var todo = DS.createRecord('to-do-list', {
      //   task: _this.get('newTask'),
      //   completed: false
      // });
      // todo.save().then(function() {
      //   _this.set('newTask', '');
      //   _this.notify.success('created new task');
      // });
    },
    removeTodo: function removeTodo(todo) {
      todo.destroyRecord();
      this.notify.alert('removed task');
    }
  }), _EmberComponent$exte));
});