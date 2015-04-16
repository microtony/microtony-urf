google.load('visualization', '1', {
  packages: ['corechart']
});
 
google.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['urfApp']);
});

var urfApp = angular.module('urfApp', ['ngRoute', 'urfControllers']);

urfApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/summary.htm',
    controller: 'SummaryCtrl'
  }).
  when('/phones/:phoneId', {
    templateUrl: 'partials/phone-detail.html',
    controller: 'PhoneDetailCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);