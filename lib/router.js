Router.map(function(){
	
	this.route('map', {
		path: '/',
		waitOn: function(){
			Meteor.subscribe("demoMapPoints");
		}
		}),
	this.route('map', {
		path: '/map/:latLng',
		waitOn: function(){
			Meteor.subscribe("demoMapPoints");
		},
		onAfterAction : function(){
			Session.set("latLng", this.params.latLng);
		}
		}),
	this.route('popup', {
		path: '/popup/:pinID'
		})
	
});
