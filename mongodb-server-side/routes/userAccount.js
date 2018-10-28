var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var Administrator = require('../models/administrator');
var PatientProfile = require('../models/patientProfile');
var Physiotherapist = require('../models/physiotherapist');
var UserAccount = require('../models/userAccount');

const crypto = require('crypto');
var rand = require('csprng');

const key = 'SE3350b Winter 2016';

function randomString(length){
    var possibles = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','u','x','y','z'];
    var theString = '';
    for(var i = 0; i < length; i++){
        theString += possibles[Math.floor(Math.random() * possibles.length)];
    }
    return theString;
}

function hash(text){
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
}

function encrypt(plainText){
    var cipher = crypto.createCipher('aes256', key);
    var crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
}

function decrypt(cipherText){
    var decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2016');
    var dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
}

//ROUTES FOR THE USER ACCOUNT
router.route('/') 
    .post(function(req, res){
        var model;
        var id;

        var salt = rand(256, 36);
        
        var userAccount = new UserAccount();
        userAccount.salt = salt;
        userAccount.encryptedPassword = hash(req.body.userAccount.encryptedPassword + salt);
        userAccount.userAccountName = req.body.userAccount.userAccountName.toLowerCase();
        userAccount.passwordMustChanged = false;
        userAccount.passwordReset = false;
        userAccount.userAccountExpiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        userAccount.administrator = req.body.userAccount.administrator;
        userAccount.patientProfile = req.body.userAccount.patientProfile;
        userAccount.physiotherapist = req.body.userAccount.physiotherapist;
        userAccount.authenticationCode = '';

        UserAccount.find({userAccountName: req.body.userAccount.userAccountName.toLowerCase()})
        .then(function(userAccounts){
            if(userAccounts.length !== 0){
                throw new Error('UserAccountName must be unique.');
            }
            if(req.body.userAccount.administrator){
                model = Administrator
                id = req.body.userAccount.administrator;
            }
            else if(req.body.userAccount.patientProfile){
                model = PatientProfile;
                id = req.body.userAccount.patientProfile;
            }
            else if(req.body.userAccount.physiotherapist){
                model = Physiotherapist;
                id = req.body.userAccount.physiotherapist;
            }
            else{
                throw new Error('UserAccount must be linked to an Administrator, PatientProfile, or Physiotherapist.');
            }

            return model.findById(id);
        }).then(function(theModel){
            if(!theModel){
                throw new Error('UserAccount must be linked to a valid Administrator, PatientProfile, or Physiotherapist.');
            }
            else{
                theModel.userAccount = userAccount._id;
                return theModel.save()
            }
        }).then(function(){
            return userAccount.save();
            res.json({userAccount: userAccount});
        }).then(function(){
            res.json({userAccount: userAccount});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function(req, res){
        UserAccount.find()
        .then(function(userAccounts){
            res.json({userAccount: userAccounts});
        }).catch(function(err){
            res.send(err);
        });
    });


router.route('/:userAccount_id')
    .get(function(req, res){
        UserAccount.findById(req.params.userAccount_id)
        .then(function(userAccount){
            res.json({userAccount: userAccount});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var userAccount;
        UserAccount.findById(req.params.userAccount_id)
        .then(function(theUserAccount){
            userAccount = theUserAccount;
            // Requesting to change password
            if(req.body.userAccount.passwordMustChanged){
                console.log('Wanting to change pass!');
                var authCode = randomString(30);
                var id;
                var model;
                if(userAccount.administrator){
                    id = userAccount.administrator;
                    model = Administrator;
                }
                else if(userAccount.physiotherapist){
                    id = userAccount.physiotherapist;
                    model = Physiotherapist;
                }
                else{
                    id = userAccount.patientProfile;
                    model = PatientProfile;
                }

                model.findById(id)
                .then(function(person){
                    var transport = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        auth: {
                            user: 'selfStartTest@gmail.com',
                            pass: 'selfStartTestPass'
                        }
                    });
                    var mailOptions = {
                        from: 'selfStartTest@gmail.com',
                        to: person.email,
                        subject: 'Forgotten Password Authentication',
                        text: 'Please enter the following authentication code on our website: ' + authCode
                    }
                    transport.sendMail(mailOptions)
                    .then(function(){
                        res.json({userAccount: userAccount});
                        userAccount.authenticationCode = authCode;
                        userAccount.passwordMustChanged = false;
                        console.log('Successfully sent authentication code.');
                        userAccount.save();
                    });
                }).catch(function(err){
                    console.log('Error sending authentication code.');
                    throw new Error(err);
                });
            }
            // Authenticating their request to change password
            else if(userAccount.authenticationCode){
                console.log('Entered authentication code.');
                if(req.body.userAccount.authenticationCode === userAccount.authenticationCode){
                    console.log('Matching authentication code.');
                    var salt = rand(256, 36);
                    userAccount.encryptedPassword = hash(req.body.userAccount.encryptedPassword + salt);
                    userAccount.salt = salt;
                    userAccount.authenticationCode = '';
                    userAccount.save()
                    .then(function(){
                        res.json({userAccount: userAccount});
                    }).catch(function(err){
                        res.send(err);
                    });
                }
                else{
                    console.log('Invalid authentication code.');
                    res.json({userAccount: userAccount});
                }
            }
            // Nothing to do with passwords
            else{
                userAccount.userAccountExpiryDate = new Date(req.body.userAccount.userAccountExpiryDate);
                userAccount.save()
                .then(function(){
                    res.json({userAccount: userAccount});
                }).catch(function(err){
                    res.send(err);
                });
            }
        }).catch(function(err){
            res.send(err);
        });
    });


module.exports = router;