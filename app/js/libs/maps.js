function google_initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(3.572967, 107.724135), //center of malaysia
    zoom: 5
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

// [START region_rectangle]
  var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(1.114277, 99.638199), //SW malaysia
      new google.maps.LatLng(8.031276, 118.974134) //NE malaysia
  );

  // Define a rectangle and set its editable property to true.
  var rectangle = new google.maps.Rectangle({
    bounds: bounds,
    editable: true,
    draggable: true
  });

  rectangle.setMap(map);
// [END region_rectangle]

  var scope = angular.element($(".initial-page")).scope();

  google.maps.event.addListener(rectangle, 'bounds_changed', function(event) {
    var ne = rectangle.getBounds().getNorthEast();
    var sw = rectangle.getBounds().getSouthWest();
    scope.$apply(function(){
      scope.tmp_filter.locations = [ sw.lng().toFixed(3), sw.lat().toFixed(3), ne.lng().toFixed(3), ne.lat().toFixed(3)];
    });
  });
}

google.maps.event.addDomListener(window, 'load', google_initialize);