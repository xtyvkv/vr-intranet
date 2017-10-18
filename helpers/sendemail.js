var AWS = require('aws-sdk');
var gconfig = require('../config/aws/config');
var config = new AWS.Config(gconfig.aws);

var ses = new AWS.SES(config);

var s = {};

s.message = function(recipient, subject, msg) {
  return {
    Destination: {
   ToAddresses: [recipient]
  },
  Message: {
   Body: {
    Html: {
     Charset: "UTF-8",
     Data: msg
    },
    Text: {
     Charset: "UTF-8",
     Data: msg
    }
   },
   Subject: {
    Charset: "UTF-8",
    Data: subject
   }
  },
  ReplyToAddresses: [
    "app@vitalresearch.com"
  ],
  ReturnPath: "app@vitalresearch.com",
  Source: "app@vitalresearch.com",
  }
}

s.send = function(params){
   ses.sendEmail(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
   });
}

module.exports = s;



