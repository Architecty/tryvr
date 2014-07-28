if(Meteor.isServer){
	Meteor.startup(function(){
		console.log("Startup functions ready");		
		
		Meteor.methods({
			addRecord: function(){
				addRecord();
			}
		});
		
		function addRecord(){
			var location = getGeocode("Berkeley, CA");
			
			insertRow("test", location)
		}
		
		function insertRow(id, latlng){
			console.log(Meteor.settings.GoogleAPI.browserKey);
			HTTP.post("https://www.googleapis.com/fusiontables/v1/query?key=" + Meteor.settings.GoogleAPI.browserKey + "&sql=" + "INSERT INTO " + Meteor.settings.GoogleAPI.fusionTableId + " (_id, Location) VALUES ('" + id + "', '" + latlng + "')",{
				//~ content : "INSERT INTO 1bTU4pOm94iafDAmuEr8XYdUgj5L7yJLJME9mOtZa (_id, Location) VALUES (" + id + ", " + latlng + ")"
			});

				
		} 
		
		function getGeocode(addressString){
			
			var geo = new GeoCoder(addressString);
			var result = geo.geocode(addressString);
			console.log("Geocode of " + addressString + " is " + result);
			return result;
		}
	})
}
			
