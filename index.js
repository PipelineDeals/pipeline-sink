var redisUrl = process.env.MESSAGE_BUS_REDIS_URL || "127.0.0.1";
var redis = require("redis"),
    redisClient = redis.createClient(6379, redisUrl);
var AWS = require('aws-sdk');

AWS.config.region = 'us-east-1';
var kinesis = new AWS.Kinesis();

redisClient.on("ready", function () {
  console.log("Connected to Redis!");
  redisClient.psubscribe("*");
});

redisClient.on("pmessage", function (pattern, channel, message) {
  // var c = channel.split(":");
  // var model = c[0];
  // var action = c[1];
  // console.log("Model: ", model);
  // console.log("Action: ", action);
  // console.log("Message: ", message);

  var params = {
    Data: message, /* required */
    PartitionKey: channel, /* required */
    StreamName: 'mantle', /* required */
  };

  kinesis.putRecord(params, function(err, data) {
    if (err) {
      console.log('Error on channel: ' + channel);
      console.log(err, err.stack);
    }
    // else     console.log(data);           // successful response
  });
});

redisClient.on("error", function (err) {
  console.log("Redis error: " + err);
});


