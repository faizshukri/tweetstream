angular.module('app')

.controller('mainController', ['$scope', '$interval', 'socket', 'googleMap', function($scope, $interval, socket, googleMap){
    var TWEET_SIZE = 3;
    var OLD_SIZE = 4;
    var SECOND_PER_TWEET = 4;
    var start = false;

    _.mixin({
        compactObject : function(o) {
             _.each(o, function(v, k){
                  v = _.compact(v);
                 if(v.length == 0)
                     delete o[k];
             });
             return o;
        }
    });

    $scope.stream = {
        collection: [],
        tweets: [],
        old: [],
        filter: false
    }

    $scope.tmp_filter = {};

    // socket.on('connect', function(){
        
    // });

    socket.on('tweets', function(data){
        $scope.stream.collection = $scope.stream.collection.concat(data);
        data.forEach(function(n,i){
            console.log(n);
        });
    });

    $scope.$watch('stream.filter', function(newVal, oldVal){
        if($scope.stream.filter && Object.keys($scope.stream.filter).length > 0){
            socket.emit('tweet-io:start', {
                start: true,
                filter: $scope.stream.filter
            });
        }
    });


    $scope.$watch('stream.collection.length', function(newVal, oldVal){
      if($scope.stream.collection.length > 0){
        startTweet();
      }
    });

    $scope.$watch('stream.old.length', function(newVal, oldVal){
      if($scope.stream.old.length > OLD_SIZE){
        $scope.stream.old.pop();
      }
    });

    var removeLast = function(){
      if($scope.stream.tweets.length > TWEET_SIZE){
         var tmp_old = $scope.stream.tweets.pop();
         if(!tmp_old.old){
           // console.log('new. push to old. ' + tmp_old.text);
           tmp_old.old = true;
           $scope.stream.old.unshift(tmp_old);
         }
      }
    }


    var startTweet = function(){
      if(start) return;
      start = true;

      var stop = $interval(function(){
        var latest = $scope.stream.collection.shift();
        if(latest){

          $scope.stream.tweets.unshift(latest);
          removeLast();

        } else if($scope.stream.old.length > 0 ){
            var getRandom = function(){
              return $scope.stream.old[Math.floor(Math.random()*$scope.stream.old.length)];
            }

            var random = getRandom();
            var inTweets = _.map($scope.stream.tweets, function(n){ return n.id; });
            while(_.indexOf(inTweets, random.id) != -1){
              random = getRandom();
            }

            $scope.stream.tweets.unshift(random);
            removeLast();
        } else {
          start = false;
          $interval.cancel(stop)
        }
      },(SECOND_PER_TWEET * 1000));
    }

    $scope.setFilter = function(){
      $scope.stream.filter = _.compactObject({
        track: [$scope.tmp_filter.track],
        locations: [$scope.tmp_filter.locations]
      });
    }

    googleMap.initialize(function(){
      $scope.tmp_filter.locations = googleMap.getLocation();
    });
    //google.maps.event.addDomListener(window, 'load', google_initialize);

}]);