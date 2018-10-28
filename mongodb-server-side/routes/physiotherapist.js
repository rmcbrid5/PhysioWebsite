/*
Segment done by Kevin Freeman 
kfreem4@uwo.ca
*/

var express = require('express');
var router = express.Router();
var Administrator = require('../models/administrator');
var PatientProfile = require('../models/patientProfile');
var Physiotherapist = require('../models/physiotherapist');
var UserAccount = require('../models/userAccount');

router.route('/') 
    .post(function(req, res){
        var physiotherapist = new Physiotherapist();
        var email = req.body.physiotherapist.email.toLowerCase();
        Administrator.find({email: email})
        .then(function(administrators){
            if(administrators.length != 0){
                throw new Error('Email already exists in Administrator.');
            }
            else{
                return PatientProfile.find({email: email});
            }
        }).then(function(patientProfiles){
            if(patientProfiles.length != 0){
                throw new Error('Email already exists in PatientProfile');
            }
            else{
                return Physiotherapist.find({email: email});
            }
        }).then(function(physiotherapists){
            if(physiotherapists.length != 0){
                throw new Error('Email already exists in Physiotherapist');
            }
            else{
                physiotherapist.familyName = req.body.physiotherapist.familyName;
                physiotherapist.givenName = req.body.physiotherapist.givenName;
                physiotherapist.email = email;
                physiotherapist.userAccount = null;
                physiotherapist.dateHired = new Date(req.body.physiotherapist.dateHired);
                physiotherapist.dateFinished = new Date(req.body.physiotherapist.dateFinished);
                physiotherapist.treatments = [];
                physiotherapist.rehabilitationPlans = [];
                physiotherapist.enabled = true;
                return physiotherapist.save();
            }
        }).then(function(){
            res.json({physiotherapist: physiotherapist});
        }).catch(function(err){
            res.send(err);
        });
    })
    
    .get(function(req, res){
        Physiotherapist.find()
        .then(function(physiotherapists){
            res.json({physiotherapist: physiotherapists});
        }).catch(function(err){
            res.send(err);
        });
    });
    
router.route('/:physiotherapist_id')
    .get(function (request, res) {
        Physiotherapist.findById(request.params.physiotherapist_id)
        .then(function(physiotherapist){
            res.json({physiotherapist: physiotherapist});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var email = req.body.physiotherapist.email.toLowerCase();
        Physiotherapist.findById(req.params.physiotherapist_id)
        .then(function(physiotherapist){
            physiotherapist.familyName = req.body.physiotherapist.familyName;
            physiotherapist.givenName = req.body.physiotherapist.givenName;
            physiotherapist.dateHired = new Date(req.body.physiotherapist.dateHired);
            physiotherapist.dateFinished = new Date(req.body.physiotherapist.dateFinished);
            physiotherapist.enabled = req.body.physiotherapist.enabled;
            return physiotherapist.save();
        }).then(function(){
            res.json({physiotherapist: physiotherapist});
        }).catch(function(err){
            res.send(err);
        });
    });
    
module.exports = router;