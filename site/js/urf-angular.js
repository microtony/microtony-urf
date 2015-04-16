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
  when('/champions', {
    templateUrl: 'partials/champion-list.html',
    controller: 'ChampionListCtrl'
  }).
  when('/champion/:c', {
    templateUrl: 'partials/champion-detail.html',
    controller: 'PhoneDetailCtrl'
  }).
  when('/about', {
    templateUrl: 'partials/about.html',
    controller: 'AboutCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);

urfApp.factory('championService', function($http) {
  var champions = [];
  var samples = { normal: 0, urf : 0};
  var loadData = function(cb) {
    $http.get('champion_stats.json').success(function(c) {
      for (var i in c) {
        samples.normal += c[i].stats.total.samples.normal;
        samples.urf += c[i].stats.total.samples.urf;
        champions.push(c[i]);
      }
      champions.sort(function(a, b) {
        if (a.name < b.name) return -1;
        return a.name == b.name ? 0 : 1;
      });
      cb();
    });
  }
  var championService = {};
  championService.load = function(cb) {
    if (champions.length == 0) {
      loadData(function() {
        cb({champions: champions, samples: samples});
      });
    } else {
      return cb({champions: champions, samples: samples});
    }
  }
  return championService;
});
