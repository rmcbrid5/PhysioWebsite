/*
Segment done by Kevin Freeman 
kfreem4@uwo.ca
*/

var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var Administrator = require('../models/administrator');
var Form = require('../models/form');
var PatientProfile = require('../models/patientProfile');
var Physiotherapist = require('../models/physiotherapist');
var UserAccount = require('../models/userAccount');

router.route('/')
    .post(function(req, res){
        var administrator = new Administrator();
        var email = req.body.administrator.email.toLowerCase();
        Administrator.find({email: email})
        .then(function(administrators){
            if(administrators.length != 0){
                throw new Error('Email already exists in Administrator.');
            }
            else{
                return Physiotherapist.find({email: email});
            }
        }).then(function(physiotherapists){
            if(physiotherapists.length != 0){
                throw new Error('Email already exists in Physiotherapist.');
            }
            else{
                return PatientProfile.find({email: email});
            }
        }).then(function(patientProfiles){
            if(patientProfiles.length != 0){
                throw new Error('Email already exists in PatientProfile.');
            }
            else{
                administrator.familyName = req.body.administrator.familyName;
                administrator.givenName = req.body.administrator.givenName;
                administrator.email = email;
                administrator.userAccount = null;
                administrator.dateHired = new Date(req.body.administrator.dateHired);
                administrator.dateFinished = null;
                administrator.forms = [];
                administrator.enabled = true;
                return administrator.save();
            }
        }).then(function(){
            res.json({administrator: administrator});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function(req, res){
        Administrator.find()
        .then(function(administrators){
            res.json({administrator: administrators});
        }).catch(function(err){
            res.send(err);
        });
    });
    
router.route('/:administrator_id')
    .get(function (req, res) {
        Administrator.findById(req.params.administrator_id)
        .then(function(administrator){
            res.json({administrator: administrator});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var administrator;
        Administrator.findById(req.params.administrator_id)
        .then(function(theAdministrator){
            administrator = theAdministrator;
            administrator.familyName = req.body.administrator.familyName;
            administrator.givenName = req.body.administrator.givenName;
            administrator.dateHired = new Date(req.body.administrator.dateHired);
            administrator.dateFinished = new Date(req.body.administrator.dateFinished);
            administrator.enabled = req.body.administrator.enabled;
            return administrator.save();
        }).then(function(){
            res.json({administrator: administrator});
        }).catch(function(err){
            res.send(err);
        });
    });
    
module.exports = router;