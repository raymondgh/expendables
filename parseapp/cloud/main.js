require('cloud/app.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("UpdateTrip", function(request, response) {
  console.log(request.body);
  response.success("Hello world!");
});
