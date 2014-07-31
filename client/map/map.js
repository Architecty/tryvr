Template.map.rendered = function(){
	initialize();
	$("#map-canvas").height($(window).height());
};

initialize = function () {
	console.log("Try Map");
		GoogleMaps.init(
			{
				'sensor': true, //optional
				'key': 'AIzaSyAUuAl8ZCH-M4caBK_kKx-11TXxxY_Op4I', //optional
				'language': 'en' //optional
			}, 
			function(){
				var mapOptions = {
					zoom: 3,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControlStyle: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
					streetViewControl: false,
					zoomControl: false,
					panControl: false,
					mapTypeControl: false
					
				};
				var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions); 
				map.setCenter(new google.maps.LatLng( 20,0 ));
				
				getMarkers();
			}
		);
		console.log("Should have rendered map");
	};

getMarkers = function(){
	
	Meteor.call('returnMarkers', function(error, result){
		for(var i = 0; i < result.length; i++){
			var marker = new google.maps.Marker({
				
				position: new google.maps.LatLng(result[i].lat, result[i].long),
				map: map,
				title: result[i].title,
				icon: result[i].icon
			});
			
			google.maps.event.addListener(marker, "click", function(){
				//When clicked, user Router to identify the selected marker
				Router.go("/map/" + this.position);
			});
		}
	});
};
