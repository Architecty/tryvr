Template.controlPanel.helpers({
	isAboutTab: function(){  if(Session.get("tab") === "about") return true; },
	isFindTab: function(){  if(Session.get("tab") === "find") return true; },
	isFilterTab: function(){  if(Session.get("tab") === "filter") return true; },
	isAddTab: function(){  if(Session.get("tab") === "add") return true; }
})

goToFind = function(){
	if(Session.get('latLng') === undefined){
		Router.go("/find");
	} else {
		Router.go("/find/" + Session.get("latLng"));
	}
}
