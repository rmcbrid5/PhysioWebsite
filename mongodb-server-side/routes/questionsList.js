var express = require('express');
var router = express.Router();
var Form = require('../models/form');
var Question = require('../models/question');
var QuestionsList = require('../models/questionsList');

router.route('/')
    .post(function (req, res) {
        var questionsList = new QuestionsList();
        questionsList.form = req.body.questionsList.form;
        questionsList.question = req.body.questionsList.question;
        Form.findById(questionsList.form)
        .then(function(form){
            form.questionsLists.push(questionsList._id);
            return form.save();
        }).then(function(){
            return Question.findById(questionsList.question);
        }).then(function(question){
            question.questionsLists.push(questionsList._id);
            return question.save();
        }).then(function(){
            return questionsList.save();
        }).then(function(){
            res.json({questionsList: questionsList});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        QuestionsList.find()
        .then(function(questionsLists){
            res.json({questionsList: questionsLists});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:questionsList_id')
    .get(function (req, res) {
        QuestionsList.findById(req.params.questionsList_id)
        .then(function(questionsList){
            res.json({questionsList: questionsList});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var questionsList;
        QuestionsList.findById(req.params.questionsList_id)
        .then(function(theQuestionsList){
            questionsList = theQuestionsList;
            return questionsList.remove();
        }).then(function(){
            return Form.findById(questionsList.form);
        }).then(function(form){
            var index = form.questionsLists.indexOf(questionsList._id);
            form.questionsLists.splice(index, 1);
            return form.save();
        }).then(function(){
            return Question.findById(questionsList.question);
        }).then(function(question){
            var index = question.questionsLists.indexOf(questionsList._id);
            question.questionsLists.splice(index, 1);
            return question.save();
        }).then(function(){
            res.json({questionsList: questionsList});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;