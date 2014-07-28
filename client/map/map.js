Template.map.created = function(){
	initialize();
	
}

makeNewPoint = function(){
	Meteor.call("addRecord");
}

initialize = function () {
	console.log("Try Map");
	//~ if(Meteor.settings.GoogleAPI){
		GoogleMaps.init(
			{
				'sensor': true, //optional
				'key': 'AIzaSyAUuAl8ZCH-M4caBK_kKx-11TXxxY_Op4I', //optional
				'language': 'en' //optional
			}, 
			function(){
				var mapOptions = {
					zoom: 3,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions); 
				map.setCenter(new google.maps.LatLng( 20,0 ));
		var layer = new google.maps.FusionTablesLayer({
			  query: {
				select: 'Basic',
				from: '1bTU4pOm94iafDAmuEr8XYdUgj5L7yJLJME9mOtZa'
			  },
			  map: map,
			});
			}
		);
			console.log("Shoudl have rendered map");
		}
	//~ }
