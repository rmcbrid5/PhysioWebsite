var express = require('express');
var router = express.Router();
var AssessmentTest = require('../models/assessmentTest');
var Recommendation = require('../models/recommendation');
var Treatment = require('../models/treatment');

//ROUTES FOR RECOMMENDATION

router.route('/') 
    .post(function(req, res){
        var recommendation = new Recommendation();
        recommendation.timeStamp = new Date(req.body.recommendation.timeStamp);
        recommendation.decision = req.body.recommendation.decision;
        recommendation.assessmentTest = req.body.recommendation.assessmentTest;
        recommendation.treatment = req.body.recommendation.treatment;

        AssessmentTest.findById(recommendation.assessmentTest)
        .then(function(assessmentTest){
            assessmentTest.recommendations.push(recommendation._id);
            return assessmentTest.save();
        }).then(function(){
            return Treatment.findById(recommendation.treatment);
        }).then(function(treatment){
            treatment.recommendations.push(recommendation._id);
            return treatment.save();
        }).then(function(){
            return recommendation.save();
        }).then(function(){
            res.json({recommendation: recommendation});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function(req, res){
        Recommendation.find()
        .then(function(recommendations){
            res.json({recommendation: recommendations});
        }).catch(function(err){
            res.send(err);
        });
    });
router.route('/:recommendation_id')
    .get(function (req, res) {
        Recommendation.findById(req.params.recommendation_id)
        .then(function(recommendation){
            res.json({recommendation: recommendation});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var recommendation;
        Recommendation.findById(req.params.recommendation_id)
        .then(function(theRecommendation){
            recommendation = theRecommendation;
            recommendation.timeStamp = new Date(req.body.recommendation.timeStamp);
            recommendation.decision = req.body.recommendation.decision;
            return recommendation.save();
        }).then(function(){
            res.json({recommendation: recommendation});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function(req, res){
        var recommendation;
        Recommendation.findById(req.params.recommendation_id)
        .then(function(theRecommendation){
            recommendation = theRecommendation;
            return recommendation.remove();
        }).then(function(){
            return AssessmentTest.findById(recommendation.assessmentTest);
        }).then(function(assessmentTest){
            var index = assessmentTest.recommendations.indexOf(recommendation._id);
            assessmentTest.recommendations.splice(index, 1);
            return assessmentTest.save();
        }).then(function(){
            return Treatment.findById(recommendation.treatment);
        }).then(function(treatment){
            var index = treatment.recommendations.indexOf(recommendation._id);
            treatment.recommendations.splice(index, 1);
            return treatment.save();
        }).then(function(){
            res.json({recommendation: recommendation});
        }).catch(function(err){
            res.send(err);
        });
    });
    
module.exports = router;