angular.module('app')
.factory('googleMap', ['$rootScope', function($rootScope){
    // var 
    // var bounds = null;

    return {
        bounds: null,
        initialize: function(callback){
          var mapOptions = {
            center: new google.maps.LatLng(3.572967, 107.724135), //center of malaysia
            zoom: 5
          };
          var map = new google.maps.Map(document.getElementById('map-canvas'),
              mapOptions);

        // [START region_rectangle]
          this.bounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(1.114277, 99.638199), //SW malaysia
              new google.maps.LatLng(8.031276, 118.974134) //NE malaysia
          );

          // Define a rectangle and set its editable property to true.
          var rectangle = new google.maps.Rectangle({
            bounds: this.bounds,
            editable: true,
            draggable: true
          });

          rectangle.setMap(map);
        // [END region_rectangle]

          // var scope = angular.element($(".initial-page")).scope();
          

          // $rootScope.$apply(function(){
          //   $rootScope.tmp_filter.locations = setLocation(bounds.getSouthWest(), bounds.getNorthEast());
          // });
          callback();

          google.maps.event.addListener(rectangle, 'bounds_changed', function(event) {
            var ne = rectangle.getBounds().getNorthEast();
            var sw = rectangle.getBounds().getSouthWest();
            $rootScope.$apply(function(){
              $rootScope.tmp_filter.locations = [ sw.lng().toFixed(3), sw.lat().toFixed(3), ne.lng().toFixed(3), ne.lat().toFixed(3)];[ sw.lng().toFixed(3), sw.lat().toFixed(3), ne.lng().toFixed(3), ne.lat().toFixed(3)];
            });
          });

        },
        getLocation: function(){
            return this.setLocation(this.bounds.getSouthWest(), this.bounds.getNorthEast());
        },
        setLocation: function(sw, ne){
            return [ sw.lng().toFixed(3), sw.lat().toFixed(3), ne.lng().toFixed(3), ne.lat().toFixed(3)];
        }
    }
}]);