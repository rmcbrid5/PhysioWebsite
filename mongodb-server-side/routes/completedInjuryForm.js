var express = require('express');
var router = express.Router();
var CompletedInjuryForm = require('../models/completedInjuryForm');
var InjuryForm = require('../models/injuryForm');
var InjuryResult = require('../models/injuryResult');

router.route('/')
    .post(function (req, res) {
        var completedInjuryForm = new CompletedInjuryForm();
        completedInjuryForm.email = req.body.completedInjuryForm.email;
        completedInjuryForm.date = new Date();
        completedInjuryForm.injuryForm = req.body.completedInjuryForm.injuryForm;
        completedInjuryForm.injuryResults = [];
        InjuryForm.findById(completedInjuryForm.injuryForm)
        .then(function(injuryForm){
            injuryForm.completedInjuryForms.push(completedInjuryForm);
            return injuryForm.save();
        }).then(function(){
            return completedInjuryForm.save();
        }).then(function(){
            res.json({completedInjuryForm: completedInjuryForm});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        CompletedInjuryForm.find()
        .then(function(completedInjuryForms){
            res.json({completedInjuryForm: completedInjuryForms});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:completedInjuryForm_id')
    .get(function (req, res) {
        CompletedInjuryForm.findById(req.params.completedInjuryForm_id)
        .then(function(completedInjuryForm){
            res.json({completedInjuryForm: completedInjuryForm});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var completedInjuryForm;
        CompletedInjuryForm.findById(req.params.completedInjuryForm_id)
        .then(function(theCompletedInjuryForm){
            completedInjuryForm = theCompletedInjuryForm;
            return completedInjuryForm.remove();
        }).then(function(){
            for(var i = 0; i < completedInjuryForm.injuryResults.length; i++){
                InjuryResult.findById(completedInjuryForm.injuryResults[i])
                .then(function(injuryResult){
                    return injuryResult.remove();
                }).catch(function(err){
                    throw new Error(err);
                });
            }
        }).then(function(){
            return InjuryForm.findById(completedInjuryForm.injuryForm);
        }).then(function(injuryForm){
            var index = injuryForm.completedInjuryForms.indexOf(completedInjuryForm._id);
            injuryForm.completedInjuryForms.splice(index, 1);
            return injuryForm.save();
        }).then(function(){
            res.json({completedInjuryForm: completedInjuryForm});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;