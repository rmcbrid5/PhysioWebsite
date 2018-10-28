var express = require('express');
var router = express.Router();
var PatientProfile = require('../models/patientProfile');
var Payment = require('../models/payment');
//=============================================
//ROUTES FOR THE PAYMENTS
router.route('/') 
    .post(function(req, res){
        var payment = new Payment();
        payment.dayTimeStamp = new Date(req.body.payment.dayTimeStamp);
        payment.amount = req.body.payment.amount;
        payment.note = req.body.payment.note;
        payment.patientProfile = req.body.payment.patientProfile;
        PatientProfile.findById(payment.patientProfile)
        .then(function(patientProfile){
            patientProfile.payments.push(payment._id);
            return patientProfile.save();
        }).then(function(){
            return payment.save();
        }).then(function(){
            res.json({payment: payment});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function(req, res){
        Payment.find()
        .then(function(payments){
            res.json({payment: payments});
        }).catch(function(err){
            res.send(err);
        });
    });
router.route('/:payment_id')
    .get(function(req, res){
        Payment.find()
        .then(function(payments){
            res.json({payment: payments});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function(req, res){
        var payment;
        Payment.findById(req.params.payment_id)
        .then(function(thePayment){
            payment = thePayment;
            return payment.remove();
        }).then(function(){
            return PatientProfile.findById(payment.patientProfile);
        }).then(function(patientProfile){
            var index = patientProfile.payments.indexOf(payment._id);
            patientProfile.payments.splice(index, 1);
            return patientProfile.save();
        }).then(function(){
            res.json({payment: payment});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports=router;