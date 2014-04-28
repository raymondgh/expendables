// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

 
// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
 
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
 
app.post('/webhook', function(req, res) {
  //res.render('hello', { message: 'Congrats, you just set up your app!' });
    console.log(req.body);
    SaveTrip(req, res)
  //res.end('{"success" : "Updated Successfully"}');
  //res.render('hello', { message: req.body.id });

});

function SaveTrip(req,res){
	  var Trip = Parse.Object.extend('Trip');
	  var tripQuery = new Parse.Query(Trip);
	  var foundTrip;
	  console.log("searching for existing trip object");
	  Parse.Push.send({
	      channels: ["harvey"],
	      data: {
	          "action":"com.parseapp.expensetracker.toq.UPDATE_STATUS",
	          "tripId":"1"
	      }
	  }, {
	      success: function () {
	          // Push was successful
	      },
	      error: function (error) {
	          // Handle error
	      }
	  });

	  tripQuery.get(req.params.objectId).then(function(trip) {
	      if (trip) {
	          foundtrip = trip;
	          foundtrip.set("business", req.body.business);
	          console.log("about to save existing trip object");
	          foundtrip.save().then(function (result) {
	              res.end('{"success" : "Updated Successfully"}');
	          });
	      } else {
	          var newTrip = new Trip();
	          newTrip.set("business", "false");
	          console.log("about to save new trip object");
	          newTrip.save().then(function (result) {
	              res.end('{"success" : "new object created"}');
	          });
	          
	      }
	});
}
	
 
app.get('/redirect', function(req, res) {
  //res.render('hello', { message: 'Congrats, you just set up your app!' });
  console.log(req.body);
  //res.render('hello', { message: req });
});

/*app.get('/simulate', function(req, res) {
  //res.render('hello', { message: 'Congrats, you just set up your app!' });
  //console.log(req);
  //res.render('hello', { message: req });
  
var TripObject = Parse.Object.extend("Trips");
var tripObject = new TripObject();
var tripID = null;

tripObject.set(
  {
        "average_mpg": 21,
        "business": true,
        "distance_m": 4777.44444444467,
        "end_location": "Test Loca",
        "end_time": 1398041460124,
        "fuel_cost_usd": 2.344,
        "start_location": "Start Location",
        "start_time": 1398038541600
    }
  );


 
tripObject.save(null, {
  success: function(tripObject) {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + tripObject.id);
    console.log(tripObject.id.toString());


  },
  error: function(tripObject, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and description.
   
  }
});
}*/
// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });
 
// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });
 
// Attach the Express app to Cloud Code.
app.listen();