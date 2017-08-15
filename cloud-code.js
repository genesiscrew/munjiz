Parse.Cloud.define("incrementChatCount", function(request, response) {
	Parse.Cloud.useMasterKey();

	var objectId = request.params.objectId;
	var query = new Parse.Query(Parse.User);
	query.equalTo("objectId", objectId);
	query.first({
		success: function(object) {
			var chatCount = object.get("total_unread");
			object.set("total_unread", chatCount+1);
			object.save();
			response.success("Success");
		},
		error: function(error) {
			response.error("Error: " + error.code + " " + error.message);
		}
	});
});


Parse.Cloud.define("decrementChatCount", function(request, response) {
	Parse.Cloud.useMasterKey();

	var objectId = request.params.objectId;
	var amount = request.params.amount;

	var query = new Parse.Query(Parse.User);
	query.equalTo("objectId", objectId);
	query.first({
		success: function(object) {
			var chatCount = object.get("total_unread");
			object.set("total_unread", chatCount-amount);
			object.save();
			response.success("Success");
		},
		error: function(error) {
			response.error("Error: " + error.code + " " + error.message);
		}
	});
});


Parse.Cloud.define("addRating", function(request, response) {
	Parse.Cloud.useMasterKey();

	// get objects
	var objectId = request.params.objectId;
	var rating = request.params.rating;

	// get user
	var query = new Parse.Query(Parse.User);
	query.equalTo("objectId", objectId);
	query.first({
		success: function(object) {
			// get total ratings sum and add new users rating
			var ratingsTotal = object.get("ratingsTotal") + rating;
			// get the number of ratings and add 1 as we are about to add one
			var numOfRatings = object.get("numOfRatings") + 1;
			// calc new rating
			var ratingsAverage = ratingsTotal / numOfRatings;

			// set new ratings
			object.set("ratingsTotal", ratingsTotal);
			object.set("numOfRatings", numOfRatings);
			object.set("ratingsAverage", ratingsAverage);

			// save and success 
			object.save();
			response.success("Success");
		},
		error: function(error) {
			response.error("Error: " + error.code + " " + error.message);
		}
	});
});