if(Meteor.isServer){
	
	Meteor.publish("demoMapPoints", function(){
		return Demos.find({retiredStatus:{$ne: "retired"}});
	});
}
