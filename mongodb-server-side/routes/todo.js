var express = require('express');
var router = express.Router();
var ToDoList = require('../models/todo');

//ROUTES FOR TODOLIST


router.route('/')
    .post(function (req, res) {
      console.log(req.body);
        var todo = new ToDoList();
        todo.task = req.body.task;
        todo.completed = req.body.completed;
        todo.save()
        .then(function(){
            res.json({todo: todo});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        ToDoList.find()
        .then(function(todo){
            res.json({todo: todo});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:todo_id')
    .get(function (req, res) {
        TodoList.findById(req.params.todo_id)
        .then(function(todo){
            res.json({todo: todo});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function (req, res) {
        TodoList.findById(req.params.todo_id)
        .then(function(todo){
            todo.task = req.body.todo.task;
            todo.completed = req.body.todo.completed;
            return todo.save();
        }).then(function(){
            res.json({todo: todo});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var todo;
        ToDoList.findById(req.params.todo_id)
        .then(function(theTodo){
            todo = theTodo;
            return todo.remove();
        }).then(function(){
            res.json({todo: todo});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;