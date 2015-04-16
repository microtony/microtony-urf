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
    templateUrl: 'partials/champion-list.htm',
    controller: 'ChampionListCtrl'
  }).
  when('/champion/:champion', {
    templateUrl: 'partials/champion-detail.htm',
    controller: 'ChampionDetailCtrl'
  }).
  when('/about', {
    templateUrl: 'partials/about.htm'
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
      for (var i in champions) {
        champions[i].normalpick = 10 * champions[i].stats.total.samples.normal / samples.normal;
        champions[i].normalwin = champions[i].stats.total.wins.normal / champions[i].stats.total.samples.normal;
        champions[i].urfpick = 10 * champions[i].stats.total.samples.urf / samples.urf;
        champions[i].urfwin = champions[i].stats.total.wins.urf / champions[i].stats.total.samples.urf;

        champions[i].primarynormal = 'ad';
        for (var j in {'ap':0, 'fighter':0, 'tank':0, 'support':0}) {
          if (champions[i].stats[j].samples.normal > champions[i].stats[champions[i].primarynormal].samples.normal) {
            champions[i].primarynormal = j;
          }
        }
        champions[i].primaryurf = 'ad';
        for (var j in {'ap':0, 'fighter':0, 'tank':0, 'support':0}) {
          if (champions[i].stats[j].samples.urf > champions[i].stats[champions[i].primaryurf].samples.urf) {
            champions[i].primaryurf = j;
          }
        }
      }
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
