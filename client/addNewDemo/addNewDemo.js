Template.addNewDemo.helpers({
});

addDemoLocation = function(){
	
	//First get the basics
	var meetupType = $('input:radio[name=demoTypeRadio]:checked').val();
	var location = $("#location").val();
	
	//Contact Page next
	var contact = {
		reddit: $("#redditInput").val(),
		mtbs: $("#mtbsInput").val(),
		devForum: $("#oculusDevInput").val(),
		twitter: $("#twitterInput").val(),
		email: $("#emailInput").val(),
		url: $("#urlInput").val(),
		otherContact: $("#otherInput").val()
		};
		
	//Now the HMDs
	var HMDS = [];
	$("input:checkbox.hmds").each(function(){
		if(this.checked){
			HMDS.push($(this).val());
		}
	});
	if($("#otherHMD").val() !== ""){
		HMDS.push($("#otherHMD").val());
	}
	
	//Next the controllers
	var controllers = [];
	$("input:checkbox.controller").each(function(){
		if(this.checked){
			controllers.push($(this).val());
		}
	});
	if($("#otherController").val() !== ""){
		controllers.push($("#otherController").val());
	}
	
	//Now the bribes
	var bribes = [];
	$("input:checkbox.bribes").each(function(){
		if(this.checked){
			bribes.push($(this).val());
		}
	});
	if($("#otherBribes").val() !== ""){
		bribes.push($("#otherBribes").val());
	}
	
	//Finally, the notes
	var note = $("#noteArea").val();
	
	
	
	Meteor.call('insertDemo', meetupType, location, contact, HMDS, controllers, bribes, note, function(error, result){
		switch(result){
		case "contacts":
			alert("You must fill out at least one method of contacting you");
			break;
		case "hmds": 
			alert("You must select at least one type of HMD");
			break;
		case "location":
			alert("Location cannot be left blank. Please fill in at least your city and country");
			break;
		case "geocode":
			alert("Geocoder could not parse your location. Please type in a more specific location, and try again");
			break;
		default:
			alert("New Demo Recorded. Please refresh to view");
			$("input:checkbox").each(function(){
				$(this).attr("checked", false);
			});
			$("#noteArea").val("");
			$("#redditInput").val("");
			$("#mtbsInput").val("");
			$("#oculusDevInput").val("");
			$("#twitterInput").val("");
			$("#emailInput").val("");
			$("#urlInput").val("");
			$("#otherInput").val("");
			$("#location").val("");
			Meteor.subscribe("demoMapPoints");
			break;
		}
		
		});
};
