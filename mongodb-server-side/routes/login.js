var express = require('express');
var router = express.Router();

var Administrator = require('../models/administrator');
var Login = require('../models/login');
var PatientProfile = require('../models/patientProfile');
var Physiotherapist = require('../models/physiotherapist');
var UserAccount = require('../models/userAccount');

const crypto = require('crypto');
var rand = require('csprng');

const key = 'SE3350b Winter 2016';

function hash(text){
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
}

function encrypt(plainText){
    try{
    var cipher = crypto.createCipher('aes256', 'SE3350b Winter 2016');
    var crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
    }
    catch(err){
        console.log('problem encrypting');
        console.log(err);
    }
    return '';
}

function decrypt(cipherText){
    try{
        var decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2016');
        var dec = decipher.update(cipherText, 'binary', 'ascii');
        dec += decipher.final('ascii');
        return dec;
    }
    catch(err){
        console.log('problem decrypting');
        console.log(err);
    }
}

function failedLogin(){
    var failed = new Login({
        nonce: null,
        token: null,
        loginFailed: true
    });

    failed.save()
    .then(function(){
        return failed;
    }).catch(function(err){
        return console.error(err);
    });
}

router.route('/')
    .post(function(req, res){
        UserAccount.findOne({userAccountName: req.body.login.userAccountName})
        .then(function(userAccount){
            if(!userAccount){
                throw new Error();
            }

            function userAccountFunc(user){
                if(user.enabled){
                    if(req.body.login.requestType === "open"){
                        Login.find({userAccountName: req.body.login.userAccountName})
                        .then(function(oldLogins){
                            for(var i = 0; i < oldLogins.length; i++){
                                oldLogins[i].remove();
                            }
                        });

                        var newLogin = new Login();
                        newLogin.userAccountName = req.body.login.userAccountName.toLowerCase();
                        newLogin.password = null;
                        newLogin.nonce = rand(256, 36);
                        newLogin.response = null;
                        newLogin.loginFailed = false;
                        newLogin.token = null;

                        newLogin.save()
                        .then(function(){
                            res.json({login: newLogin});
                        }).catch(function(err){
                            res.json({login: failedLogin()});
                        });
                    }
                    else if(req.body.login.requestType === "openResponse"){
                        if(req.body.login.response){
                            var receivedNonce = decrypt(req.body.login.response);
                            Login.findOne({userAccountName: req.body.login.userAccountName.toLowerCase(), nonce: receivedNonce})
                            .then(function(theLogin){
                                if(theLogin){
                                    var receivedPassword = req.body.login.password;
                                    var storedPassword = userAccount.encryptedPassword;
                                    var salt = userAccount.salt;
                                    var saltedPassword = hash(receivedPassword + salt);

                                    if(saltedPassword === storedPassword){  // password is correct
                                        if(userAccount.passwordReset){  // password is pending a chahnge
                                            var rec = new Login();
                                            rec.token = null;
                                            rec.passwordReset = true;

                                            res.json({login: rec});
                                        }
                                        else{   // password is not pending a change
                                            var rec = new Login();
                                            var token;
                                            if(userAccount.administrator){
                                                token = 'ad' + userAccount.administrator;
                                            }
                                            else if(userAccount.physiotherapist){
                                                token = 'ph' + userAccount.physiotherapist;
                                            }
                                            else{
                                                token = 'pa' + userAccount.patientProfile;
                                            }
                                            token += userAccount._id;
                                            theLogin.token = encrypt(token);
                                            theLogin.sessionActive = true;
                                            theLogin.loginFailed = false;
                                            theLogin.save()
                                            .then(function(){
                                                var rec = new Login();
                                                rec.token = encrypt(token);
                                                rec.sessionIsActive = true;
                                                rec.loginFailed = false;

                                                res.json({login: rec});
                                            }).catch(function(){
                                                res.json({login: failedLogin()});
                                            });
                                        }
                                    }
                                    else{   // password is wrong
                                        var rec = new Login();
                                        rec.token = null;
                                        rec.nonce = null;
                                        rec.response = null;
                                        rec.wrongPassword = true;

                                        res.json({login: rec});
                                    }
                                }
                                else{
                                    res.json({login: failedLogin()});
                                }
                            }).catch(function(err){
                                res.json({login: failedLogin()});
                            });
                        }
                        else{
                            res.json({login: failedLogin()});
                        }
                    }
                    else if(req.body.login.requestType === 'fetch'){
                        var connection = new Login();
                        connection.userAccountName = req.body.login.userAccountName;
                        connection.password = null;
                        connection.nonce = rand(256, 36);
                        connection.response = null;
                        connection.token = null;

                        connection.save()
                        .then(function(){
                            res.json({login: connection});
                        }).catch(function(err){
                            res.json({login: failedLogin()});
                        });
                    }
                    else if(req.body.login.requestType === 'fetchResponse'){
                        var nonceResponse = decrypt(req.body.login.response);
                        Login.findOne({userAccountName: req.body.login.userAccountName, nonce: nonceResponse})
                        .then(function(theLogin){
                            if(!theLogin){
                                throw new Error();
                            }
                            else{
                                var newLogin = new Login();
                                newLogin.loginFailed = false;

                                UserAccount.findOne({userAccountName: req.body.login.userAccountName })
                                .then(function(userAccount){
                                    if(!userAccount){
                                        res.json({login: failedLogin()});
                                    }
                                    else{
                                        if(userAccount.administrator){
                                            newLogin.token = 'ad' + userAccount.administrator + userAccount._id;
                                        }
                                        else if(userAccount.physiotherapist){
                                            newLogin.token = 'ph' + userAccount.physiotherapist + userAccount._id;
                                        }
                                        else{
                                            newLogin.token = 'pa' + userAccount.patientProfile + userAccount._id;
                                        }
                                        newLogin.token = encrypt(newLogin.token);
                                        res.json({login: newLogin});
                                    }
                                }).catch(function(err){
                                    res.json({login: failedLogin()});
                                });
                            }
                        }).catch(function(err){
                            res.json({login: failedLogin()});
                        });
                    }
                    else{
                        res.json({login: failedLogin()});
                    }
                }
                else{
                    var accountDisabled = new Login();
                    accountDisabled.userAccountName = req.body.login.userAccountName;
                    accountDisabled.password = null;
                    accountDisabled.nonce = null;
                    accountDisabled.response = null;
                    accountDisabled.token = null;
                    accountDisabled.accountIsDisabled = true;
                    res.json({login: accountDisabled});
                }
            }

            var model;
            var id;

            if(userAccount.administrator){
                model = Administrator;
                id = userAccount.administrator;
            }
            else if(userAccount.patientProfile){
                model = PatientProfile;
                id = userAccount.patientProfile;
            }
            else{
                model = Physiotherapist;
                id = userAccount.physiotherapist;
            }

            model.findById(id)
            .then(userAccountFunc)
            .catch(function(err){
                throw new Error();
            });

        }).catch(function(err){
            var badUserAccountName = new Login();
            badUserAccountName.userAccountName = req.body.login.userAccountName;
            badUserAccountName.password = null;
            badUserAccountName.nonce = null;
            badUserAccountName.response = null;
            badUserAccountName.token = null;
            badUserAccountName.wrongUserAccountName = true;

            res.json({login: badUserAccountName});
        });
    })
    .get(function(req, res){
        Login.find()
        .then(function(logins){
            res.json({login: logins});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:login_id')
    .delete(function(req, res){
        var login;
        Login.findById(req.params.login_id)
        .then(function(theLogin){
            login = theLogin;
            return login.remove();
        }).then(function(){
            res.json({login: login});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;