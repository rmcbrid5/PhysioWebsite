var express = require('express');
var router = express.Router();
var Administrator = require('../models/administrator');
var AssessmentTest = require('../models/assessmentTest');
var CompletedInjuryForm = require('../models/completedInjuryForm');
var InjuryForm = require('../models/injuryForm');
var InjuryResult = require('../models/injuryResult');
var Form = require('../models/form');
var Physiotherapist = require('../models/physiotherapist');
var Question = require('../models/question');
var QuestionsList = require('../models/questionsList');
var Recommendation = require('../models/recommendation');
var RehabilitationPlan = require('../models/rehabilitationPlan');
var TestResult = require('../models/testResult');
var Treatment = require('../models/treatment');

//ROUTES FOR THE FORMS
router.route('/')
	.post(function(req, res){
		var form = new Form();
		form.name = req.body.form.name;
		form.description = req.body.form.description;
		form.administrator = req.body.form.administrator;
		form.assessmentTests = [];
		form.injuryForms = [];
		form.questionsLists = [];
		Administrator.findById(form.administrator)
		.then(function(administrator){
			administrator.forms.push(form._id);
			return administrator.save();
		}).then(function(){
			return form.save();
		}).then(function(){
			res.json({form: form});
		}).catch(function(err){
			res.send(err);
		});
	})
	.get(function(req, res){
		Form.find()
		.then(function(forms){
			res.json({form: forms});
		}).catch(function(err){
			res.send(err);
		});
	});
router.route('/:form_id')
    .get(function(req, res){
		Form.findById(req.params.form_id)
		.then(function(forms){
			res.json({form: forms});
		}).catch(function(err){
			res.send(err);
		});
    })
	.put(function(req, res){
		var form;
		Form.findById(req.params.form_id)
		.then(function(theForm){
			form = theForm;
			form.name = req.body.form.name;
			form.description = req.body.form.description;
			return form.save();
		}).then(function(){
			res.json({form: form});
		}).catch(function(err){
			res.send(err);
		});
	})
	.delete(function(req, res){
		var form;
		Form.findById(req.params.form_id)
		.then(function(theForm){
			form = theForm;
			return form.remove();
		}).then(function(){
			return Administrator.findById(form.administrator);
		}).then(function(administrator){
			var index = administrator.forms.indexOf(form._id);
			administrator.forms.splice(index, 1);
			return administrator.save();
		}).then(function(){
			var assessmentTest;
			var recommendation;
			var testResult;
			function removeAssessmentTests(index){
				if(index !== form.assessmentTests.length){
					return Assessment.findById(form.assessmentTests[index])
					.then(function(theAssessmentTest){
						assessmentTest = theAssessmentTest;
						return assessmentTest.remove();
					}).then(function(){
						return removeRecommendations(0);
					}).then(function(){
						return removeTestResults(0);
					}).then(function(){
						return RehabilitationPlan.findById(assessmentTest.rehabilitationPlan);
					}).then(function(rehabilitationPlan){
						var index = rehabilitationPlan.assessmentTests.indexOf(assessmentTest._id);
						rehabilitationPlan.assessmentTests.splice(index, 1);
						return rehabilitationPlan.save();
					}).then(function(){
						return removeAssessmentTests(index + 1);
					})
					.catch(function(err){
						throw new Error(err);
					});
				}
			}

			function removeRecommendations(index){
				if(index !== assessmentTest.recommendations.length){
					return Recommendation.findById(assessmentTest.recommendations[index])
					.then(function(theRecommendation){
						recommendation = theRecommendation;
						return recommendation.remove();
					}).then(function(){
						return Treatment.findById(recommendation.treatment);
					}).then(function(treatment){
						var index = treatment.recommendations.indexOf(recommendation._id);
						treatment.recommendations.splice(index, 1);
						return treatment.save();
					}).then(function(){
						return removeRecommendations(index + 1);
					}).catch(function(err){
						throw new Error(err);
					});
				}
			}

			function removeTestResults(index){
				if(index !== assessmentTest.testResults.length){
					return TestResult.findById(assessmentTest.testResults[index])
					.then(function(theTestResult){
						testResult = theTestResult;
						return testResult.remove();
					}).then(function(){
						return Treatment.findById(testResult.treatment);
					}).then(function(treatment){
						var index = treatment.testResults.indexOf(testResult._id);
						treatment.testResults.splice(index, 1);
						return treatment.save();
					}).then(function(){
						return removeTestResults(index + 1);
					}).catch(function(err){
						throw new Error(err);
					});
				}
			}

			return removeAssessmentTests(0);
		}).then(function(){
			var injuryForm;
			var completedInjuryForm;
			var injuryResult;

			function removeInjuryForms(index){
				if(index !== form.injuryForms.length){
					return InjuryForm.findById(form.injuryForms[index])
					.then(function(theInjuryForm){
						injuryForm = theInjuryForm;
						return injuryForm.remove();
					}).then(function(){
						return removeInjuryForms(0);
					}).then(function(){
						return removeInjuryForms(index + 1);
					}).catch(function(err){
						throw new Error(err);
					});
				}
			}

			function removeCompletedInjuryForms(index){
				if(index !== injuryForm.completedInjuryForms.length){
					return CompletedInjuryForm.findById(injuryForm.completedInjuryForms[index])
					.then(function(theCompletedInjuryForm){
						completedInjuryForm = theCompletedInjuryForm;
						return completedInjuryForm.remove();
					}).then(function(){
						return removeInjuryResults(0);
					}).catch(function(err){
						throw new Error(err);
					});
				}
			}

			function removeInjuryResults(index){
				if(index !== completedInjuryForm.injuryResults.length){
					return InjuryResult.findById(completedInjuryForm.injuryResults[index])
					.then(function(theInjuryResult){
						injuryResult = theInjuryResult;
						return injuryResult.remove();
					}).then(function(){
						removeInjuryResults(index + 1);
					}).catch(function(err){
						throw new Error(err);
					});
				}
			}

			return removeInjuryForms(0);
		}).then(function(){
			function removeQuestionsLists(index){
				if(index !== form.questionsLists.length){
					var questionsList;
					return QuestionsLists.findById(form.questionsLists[index])
					.then(function(theQuestionsList){
						questionsList = theQuestionsList;
						return questionsList.remove();
					}).then(function(){
						return Question.findById(questionsList.question);
					}).then(function(question){
						var index = question.questionsLists.indexOf(questionsList._id);
						question.questionsLists.splice(index, 1);
						return question.save();
					}).then(function(){
						return removeQuestionsLists(index + 1);
					}).catch(function(err){
						throw new Error(err);
					});
				}
			}

			return removeQuestionsLists(0);
		}).then(function(){
			res.json({form: form});
		}).catch(function(err){
			res.send(err);
		});
	});
    
module.exports = router;