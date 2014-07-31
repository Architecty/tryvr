Template.findTab.helpers({
	
	nearbyDemos: function(){
		var latLong = Session.get("latLng").split(",");
		var lat = latLong[0].replace("(", "").trim();
		var lng = latLong[1].replace(")", "").trim();
		
		return Demos.find({loc:{$near:[lng, lat], $maxDistance:0.01}});
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
