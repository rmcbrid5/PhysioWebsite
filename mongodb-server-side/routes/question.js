var express = require('express');
var router = express.Router();
var Form = require('../models/form');
var Question = require('../models/question');
var QuestionType = require('../models/questionType');

//ROUTES FOR THE QUESTIONS
router.route('/')
	.post(function(req, res){
		var question = new Question();
		question.questionText = req.body.question.questionText;
		question.helpDescription = req.body.question.helpDescription;
		question.questionType = req.body.question.questionType;
		question.questionsLists = [];
		QuestionType.findById(question.questionType)
		.then(function(questionType){
			questionType.questions.push(question._id);
			return questionType.save();
		}).then(function(){
			return question.save();
		}).then(function(){
			res.json({question: question});
		}).catch(function(err){
			res.send(err);
		});
	})
	.get(function(req, res){
		Question.find()
		.then(function(questions){
			res.json({question: questions});
		}).catch(function(err){
			res.send(err);
		});
	});
router.route('/:question_id')
    .get(function(req, res){
		Question.findById(req.params.question_id)
		.then(function(question){
			res.json({question: question});
		}).catch(function(err){
			res.send(err);
		});
    })
	.put(function(req, res){
		var question;
		Question.findById(req.params.question_id)
		.then(function(theQuestion){
			question = theQuestion;
			question.questionText = req.body.question.questionText;
			question.helpDescription = req.body.question.helpDescription;
			return question.save();
		}).then(function(){
			res.json({question: question});
		}).catch(function(err){
			res.send(err);
		});
	})
	.delete(function(req, res){
		var question;
		Question.findById(req.params.question_id)
		.then(function(theQuestion){
			question = theQuestion;
			return question.remove();
		}).then(function(){
			return QuestionType.findById(question.questionType);
		}).then(function(questionType){
			var index = questionType.questions.indexOf(question._id);
			questionType.questions.splice(index, 1);
			return questionType.save();
		}).then(function(){
			var questionsList;
			function removeQuestionsLists(index){
				if(index !== question.questionsLists.length){
					return QuestionsList.findById(question.questionsLists[index])
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
						return removeQuestionsLists(index + 1);
					}).catch(function(err){
						throw new Error(err);
					});
				}
			}

			return removeQuestionsLists(0);
		}).then(function(){
			res.json({question: question});
		}).catch(function(err){
			res.send(err);
		});
	});
    
module.exports = router;