var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
router.route('/:name/:email/:phone/:message')
    .get(function (req, res) {
        var fName = req.params.name;
        var fromEmail = req.params.email;
        var toEmail = 'selfStartTest@gmail.com';
        var subject = "Message from SelfStartBodySmart Website";
        var text = req.params.message;
        var phone = req.params.phone;
        var mailOptions = {
            from: fName,
            to: toEmail,
            subject: subject,
            text: "Sender Name: " + JSON.stringify(fName) + " Sender Phone Number: " + JSON.stringify(phone) + " Sender Email: " + JSON.stringify(fromEmail) + " Message: " + JSON.stringify(text)
        };
        smtpTransport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.send('Message received!');
                console.log('Email sent: ' + info.response);
            }
        });
    });
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    auth: {
        user: 'selfStartTest@gmail.com',
        pass: 'selfStartTestPass'
    }
});
module.exports = router;