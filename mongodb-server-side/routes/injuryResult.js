var express = require('express');
var router = express.Router();
var CompletedInjuryForm = require('../models/completedInjuryForm');
var InjuryResult = require('../models/injuryResult');

router.route('/')
    .post(function (req, res) {
        var injuryResult = new InjuryResult();
        injuryResult.questionText = req.body.injuryResult.questionText;
        injuryResult.answer = req.body.injuryResult.answer;
        injuryResult.completedInjuryForm = req.body.injuryResult.completedInjuryForm;
        CompletedInjuryForm.findById(injuryResult.completedInjuryForm)
        .then(function(completedInjuryForm){
            completedInjuryForm.injuryResults.push(injuryResult._id)
            return completedInjuryForm.save();
        }).then(function(){
            return injuryResult.save();
        }).then(function(){
            res.json({injuryResult: injuryResult});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        InjuryResult.find()
        .then(function(injuryResults){
            res.json({injuryResult: injuryResults});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:injuryResult_id')
    .get(function (req, res) {
        InjuryResult.findById(req.params.injuryResult_id)
        .then(function(injuryResult){
            res.json({injuryResult: injuryResult});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;