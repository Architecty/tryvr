if(Meteor.isServer){
	Meteor.startup(function(){
		console.log("Startup functions ready");		
		
		Meteor.methods({
			insertDemo: function(meetupType, location, contact, HMDS, controllers, bribes, note){
				return insertDemo(meetupType, location, contact, HMDS, controllers, bribes, note);
			},
			returnMarkers: function(){
				return returnMarkers();
			}
		});
		
		function insertDemo(meetupType, location, contact, HMDS, controllers, bribes, note){
			var geocode = [];
			
			if(location == ""){
				return "location";
			}
			if(location != null) geocode = getGeocode(location)[0];
			
			console.log(geocode.city);
			if(geocode.city == null){
				return "geocode";
			}
			
			//Check to make sure that at least one of the contacts has something in it
			var totalContacts = "";
			for(var key in contact){
				if(contact.hasOwnProperty(key)){
					totalContacts += contact[key];
				}
			}
			if(totalContacts.length < 4){
				return "contacts";
			}
			
			//Check to make sure at least one HMD is marked
			if(HMDS.length < 1){
				return "hmds";
			}
			
			var demoID = Demos.insert({
				userType: meetupType,
				contactMethods:contact,
				location: location,
				loc:{
					lon: geocode.longitude, 
					lat: geocode.latitude
					},
				geocode: geocode,
				headsets: HMDS,
				peripherals: controllers,
				bribes: bribes,
				note: note
			});
			console.log("Added record for ", location);
			return "success";
		}
		
		function getGeocode(addressString){
			
			var geo = new GeoCoder(addressString);
			var result = geo.geocode(addressString);
			console.log("Geocode of " + addressString + " is " + result);
			return result;
		}
		
		//Use this to get a simplified set of markers, accounting for markers that are in the same city
		function returnMarkers(){
	
			demoPoints = Demos.find().fetch();
			
			var uniqueLatLng = [];
			var allPoints = [];
			
			for(var i = 0; i < demoPoints.length; i++){
				var latlng = demoPoints[i].geocode.latitude + "," + demoPoints[i].geocode.longitude;
				if(uniqueLatLng.indexOf(latlng) == -1){
					uniqueLatLng.push(latlng);
					
					var tempObject = {
						_id: demoPoints[i]._id,
						lat: demoPoints[i].geocode.latitude,
						long: demoPoints[i].geocode.longitude, 
						icon: "", 
						title: demoPoints[i].geocode.city + ", " + demoPoints[i].geocode.stateCode + ", " + demoPoints[i].geocode.countryCode
					}
					switch(demoPoints[i].userType){
						case "individual": 
							tempObject.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
							break;
						case "meetup": 
							tempObject.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
							break;
						default:
							tempObject.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
					}
					allPoints.push(tempObject);
				}
			}
			return allPoints;
		}
	});
	
	
	
	Meteor.publish("demoMapPoints", function(){
		return Demos.find({});
	});
}
			
