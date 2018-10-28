var express = require('express');
var router = express.Router();
var Appointment = require('../models/appointment');
var PatientProfile = require('../models/patientProfile');

router.route('/')
    .post(function(req, res){
        var appointment = new Appointment();
        appointment.date = new Date(req.body.appointment.date);
        appointment.reason = req.body.appointment.reason;
        appointment.other = req.body.appointment.other;
        appointment.patientProfile = req.body.appointment.patientProfile;
        
        Appointment.find()
        .then(function(appointments){
            for(var  i = 0; i < appointments.length; i++){
                var theDate = new Date(appointments[i].date);
                if(theDate.getFullYear() == appointment.date.getFullYear() &&
                theDate.getMonth() == appointment.date.getMonth() &&
                theDate.getDay() == appointment.date.getDay() &&
                theDate.getHours() == appointment.date.getHours()){
                    throw new Error('Cannot create appointment during existing appointment.');
                }
            }
            return PatientProfile.findById(appointment.patientProfile);
        }).then(function(patientProfile){
            patientProfile.appointments.push(appointment._id);
            return patientProfile.save();
        }).then(function(){
            return appointment.save();
        }).then(function(){
            res.json({appointment: appointment});
        }).catch(function(err){
            res.send(err);
        });
    })

    .get(function(req, res){
        Appointment.find()
        .then(function(appointments){
            res.json({appointment: appointments});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:appointment_id')
    .get(function (request, response) {
        Appointment.findById(req.params.appointment_id)
        .then(function(appointment){
            res.json({appointment: appointment});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var appointment;
        Appointment.findById(req.params.appointment_id)
        .then(function(theAppointment){
            appointment = theAppointment;
            appointment.date = new Date(req.body.appointment.date);
            appointment.reason = req.body.appointment.reason;
            appointment.other = req.body.appointment.other;
            return appointment.save();
        }).then(function(){
            res.json({appointment: appointment});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function(req, res){
        var appointment;
        Appointment.findById(req.params.appointment_id)
        .then(function(theAppointment){
            appointment = theAppointment;
            return appointment.remove();
        }).then(function(){
            return PatientProfile.findById(appointment.patientProfile);
        }).then(function(patientProfile){
            var index = patientProfile.appointments.indexOf(appointment._id);
            patientProfile.appointments.splice(index, 1);
            return patientProfile.save();
        }).then(function(){
            res.json({appointment: appointment});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;