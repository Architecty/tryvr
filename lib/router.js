Router.map(function(){
	
	//The main page, showing all points and the 'about' title
	this.route('map', {
		path: '/',
		waitOn: function(){
			Meteor.subscribe("demoMapPoints");
		},
		onAfterAction : function(){
			Session.set("tab", "about")
		}
		}),
	//Set the 'Find' tab, where you see information about the selected pins
	this.route('map', {
		path: '/find/:latLng?',
		waitOn: function(){
			Meteor.subscribe("demoMapPoints");
		},
		onAfterAction : function(){
			Session.set("latLng", this.params.latLng);
			Session.set("tab", "find")
		}
		}),
	//The 'Add' tab, with all of it's subsidiary pills.
	this.route('map', {
		path: '/add/:subtab?',
		waitOn: function(){
			Meteor.subscribe("demoMapPoints");
		},
		onAfterAction : function(){
			Session.set("tab", "add");
			Session.set("subtab", this.params.subtab);
		}
		}),
	//The 'Filter' tab, allowing for filters based on the type of headset and more.
	this.route('map', {
		path: '/filter/:subtab?',
		waitOn: function(){
			Meteor.subscribe("demoMapPoints");
		},
		onAfterAction : function(){
			Session.set("tab", "filter");
			Session.set("subtab", this.params.subtab);
		}
		})
	
});
