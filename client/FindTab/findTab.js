Template.findTab.helpers({
	
	nearbyDemos: function(){
		if(Session.get("latLng")){
			var latLong = Session.get("latLng").split(",");
			var lat = latLong[0].replace("(", "").trim();
			var lng = latLong[1].replace(")", "").trim();
			
			return Demos.find({loc:{$near:[lng, lat], $maxDistance:0.01}});
		}
	},
	
	isMeetup: function(){
		if(this.userType == "group"){
			return true;
		}
		else {
			return false;
		}
	},
	
	areBribes: function(){
		if(this.bribes.length > 0 ){
			return true;
		}
		else{
			return false;
		}
	}
	
});

retireListing = function(demoID){
	var reason = prompt("Are you sure you want to remove yourself from the list?\n\nWe are sorry to see you go! Can you tell us why you won't be demoing using this map?");
	
	if(reason != null){
		Meteor.call("retireListing", demoID, reason);
		initialize();
	}
}
