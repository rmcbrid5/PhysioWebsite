var express = require('express');
var router = express.Router();
var Form = require('../models/form');
var InjuryForm = require('../models/injuryForm');
var InjuryResult = require('../models/injuryResult');

router.route('/')
    .post(function (req, res) {
        var injuryForm = new InjuryForm();
        injuryForm.name = req.body.injuryForm.name;
        injuryForm.form = req.body.injuryForm.form;
        injuryForm.completedInjuryForms = [];
        Form.findById(injuryForm.form)
        .then(function(form){
            form.injuryForms.push(injuryForm._id);
            return form.save();
        }).then(function(){
            return injuryForm.save();
        }).then(function(){
            res.json({injuryForm: injuryForm});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        InjuryForm.find()
        .then(function(injuryForms){
            res.json({injuryForm: injuryForms});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:injuryForm_id')
    .get(function (req, res) {
        InjuryForm.findById(req.params.injuryForm_id)
        .then(function(injuryForm){
            res.json({injuryForm: injuryForm});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function (req, res) {
        var injuryForm;
        InjuryForm.findById(req.params.injuryForm_id)
        .then(function(theInjuryForm){
            injuryForm = theInjuryForm;
            injuryForm.name = req.body.injuryForm.name;
            return injuryForm.save();
        }).then(function(){
            res.json({injuryForm: injuryForm});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var injuryForm;
        InjuryForm.findById(req.params.injuryForm_id)
        .then(function(theInjuryForm){
            injuryForm = theInjuryForm;
            return injuryForm.remove();
        }).then(function(){
            var completedInjuryForm;

            function removeCompletedInjuryForms(index){
                if(index !== injuryForm.completedInjuryForms.length){
                    return CompletedInjuryForm.findById(injuryForm.completedInjuryForms[index])
                    .then(function(theCompletedInjuryForm){
                        completedInjuryForm = theCompletedInjuryForm;
                        return completedInjuryForm.remove();
                    }).then(function(){
                        return removeInjuryResults(0);
                    }).then(function(){
                        return removeCompletedInjuryForms(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            function removeInjuryResults(index){
                if(index !== completedInjuryForm.injuryResults.length){
                    return InjuryResult.findById(completedInjuryForm.injuryResults[index])
                    .then(function(injuryResult){
                        return injuryResult.remove();
                    }).then(function(){
                        return removeInjuryResults(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return removeCompletedInjuryForms(0);
        }).then(function(){
            return Form.findById(injuryForm.form);
        }).then(function(form){
            var index = form.injuryForms.indexOf(injuryForm._id);
            form.injuryForms.splice(index, 1);
            return form.save();
        }).then(function(){
            res.json({injuryForm: injuryForm});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;