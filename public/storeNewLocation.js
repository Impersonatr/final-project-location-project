
//initiate an HTTP Request containing user-input data to add a new location to the database

function storeNewLocation(title, lati, longi, desc, callback) {
	var postUrl = '/add-place';
	
	var postRequest = new XMLHttpRequest();
	postRequest.open('POST', postUrl);
	postRequest.setRequestHeader('Content-Type', 'application/json');
	
	postRequest.addEventListener('load', function (event) {
    var error;
    if (event.target.status !== 200) {
		error = event.target.response;
    }
	callback(error);
	});
	
	postRequest.send(JSON.stringify({
		"title": title,
		"latitude": lati,
		"longitude": longi,
		"description": desc
  }));
}