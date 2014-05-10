angular.module('app')

.directive('tweet', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/tweet.html'
    }
});