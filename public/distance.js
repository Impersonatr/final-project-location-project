//distance calculation between two points

function getDistance(lat1In, long1In, lat2In, long2In){
  var lat1 = lat1In;
  var lat2 = lat2In;
  var long1 = long1In;
  var long2 = long2In;
  var deltaLat;
  var deltaLong;

  var R = 3961; //this is the radius of the Earth in miles
  deltaLat = lat2 - lat1;
  deltaLong = long2 - long1;
  var x = Math.pow(Math.sin(deltaLat * Math.PI / 180.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLong * Math.PI / 180.0), 2);
  var y = 2 * Math.atan2(sqrt(x), sqrt(1-x));
  var dist = R * c;
}
