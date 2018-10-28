var express = require('express');
var router = express.Router();
var Question = require('../models/question');
var QuestionType = require('../models/questionType');

//ROUTES FOR THE QUESTIONTYPES
router.route('/')
	.post(function(req, res){
		var questionType = new QuestionType();
		questionType.name = req.body.questionType.name;
		questionType.questions = [];
		questionType.save()
		.then(function(){
			res.json({questionType: questionType});
		}).catch(function(err){
			res.send(err);
		});
	})
	.get(function(req, res){
		QuestionType.find()
		.then(function(questionTypes){
			res.json({questionType: questionTypes});
		}).catch(function(err){
			res.send(err);
		});
	});
router.route('/:questionType_id')
    .get(function(req, res){
		QuestionType.findById(req.params.questionType_id)
		.then(function(questionType){
			res.json({questionType: questionType});
		}).catch(function(err){
			res.send(err);
		});
    })
	.put(function(req, res){
		var questionType;
		QuestionType.findById(req.params.questionType_id)
		.then(function(theQuestionType){
			questionType = theQuestionType;
			questionType.name = req.body.questionType.name;
			return questionType.save();
		}).then(function(){
			res.json({questionType: questionType});
		}).catch(function(err){
			res.send(err);
		});
	})
	.delete(function(req, res){
		var questionType;
		QuestionType.findById(req.params.questionType_id)
		.then(function(theQuestionType){
			questionType = theQuestionType;
			return questionType.remove();
		}).then(function(){
			var question;
			var questionsList;
			function removeQuestions(index){
				if(index !== questionType.questions.length){
					return Question.findById(questionType.questions[index])
					.then(function(theQuestion){
						question = theQuestion;
						return question.remove();
					}).then(function(){
						return removeQuestionsLists(0);
					}).then(function(){
						return removeQuestions(index + 1);
					}).catch(function(err){
						throw new Error(err);
					});
				}
			}

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

			return removeQuestions(0);
		}).then(function(){
			res.json({questionType: questionType});
		}).catch(function(err){
			res.send(err);
		});
	});
    
module.exports = router;