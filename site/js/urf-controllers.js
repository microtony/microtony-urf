var urfControllers = angular.module('urfControllers', ['googlechart']);
var stylenames = {
  'ad': 'Marksman',
  'ap': 'Mage',
  'fighter': 'Fighter',
  'support': 'Support',
  'tank': 'Tank'
};
var percentage = function(v) {
  return '<span class="percentage">' + (v * 100).toFixed(2) + '%</span>';
};
urfControllers.filter('percentage', function() { return function(v) { return (v * 100).toFixed(2) + '%';} });
urfControllers.filter('twodp', function() { return function(v) { return v.toFixed(2); } });
var changeicon = function(v) {
  if (v < 0) {
    return '<span class="glyphicon glyphicon-triangle-top stats-increase" aria-hidden="true"></span>';
  }
  return '<span class="glyphicon glyphicon-triangle-bottom stats-decrease" aria-hidden="true"></span>';
};
urfControllers.filter('changeicon', function() { return changeicon; });
var styletext = function(v) {
  return '<span class="styletext-' + v + '">' + stylenames[v] + '</span>';
}
urfControllers.filter('styletext',  function() { return styletext; });

urfControllers.controller('AboutCtrl', function($scope, championService) {
  $scope.champions = [];
  championService.load(function(c) {
    $scope.clusterChampions = {
      'ad' : 'Caitlyn MasterYi Sivir Tristana MissFortune Ashe Tryndamere Twitch Gangplank Corki Vayne Ezreal KogMaw Graves Varus Draven Quinn Yasuo Jinx Lucian Kalista'.split(/ /),
      'ap' : 'Ziggs Annie Galio TwistedFate Leblanc Vladimir FiddleSticks Kayle Ryze Teemo Morgana Zilean Singed Karthus Chogath Anivia Kassadin Karma Veigar Swain Katarina Orianna Brand Rumble Cassiopeia Heimerdinger Nidalee Mordekaiser Akali Kennen Malzahar Lux Xerath Ahri Fizz Viktor Lulu Lissandra Diana Syndra Zyra Velkoz Azir'.split(/ /),
      'fighter' : 'Riven Urgot Shaco Nocturne Renekton JarvanIV MonkeyKing LeeSin Pantheon Talon Rengar Fiora Khazix Darius Jayce Zed Aatrox RekSai'.split(/ /),
      'support' : 'Thresh Alistar Soraka Sona Janna Taric Blitzcrank Leona Nautilus Braum Nami Bard'.split(/ /),
      'tank' : 'Shen Olaf XinZhao Sion Warwick Nunu Jax Evelynn Amumu Rammus DrMundo Irelia Trundle Malphite Maokai Elise Skarner Nasus Udyr Poppy Gragas Yorick Garen Shyvana Volibear Sejuani Hecarim Gnar Zac Vi'.split(/ /)
    };
    $scope.overall = {
      "total": {
        "samples": {
          "normal": 801086,
          "urf": 919862
        },
        "wins": {
          "normal": 400922,
          "urf": 460265
        },
        "kills": {
          "normal": 4911436,
          "urf": 9445950
        }
      },
      "ad": {
        "samples": {
          "normal": 187188,
          "urf": 179818
        },
        "wins": {
          "normal": 94514,
          "urf": 90902
        },
        "kills": {
          "normal": 1495817,
          "urf": 1872482
        }
      },
      "ap": {
        "samples": {
          "normal": 210732,
          "urf": 537036
        },
        "wins": {
          "normal": 106558,
          "urf": 268642
        },
        "kills": {
          "normal": 1427046,
          "urf": 5646776
        }
      },
      "fighter": {
        "samples": {
          "normal": 106658,
          "urf": 96070
        },
        "wins": {
          "normal": 51882,
          "urf": 48815
        },
        "kills": {
          "normal": 766176,
          "urf": 1028732
        }
      },
      "tank": {
        "samples": {
          "normal": 176405,
          "urf": 100360
        },
        "wins": {
          "normal": 89053,
          "urf": 49096
        },
        "kills": {
          "normal": 988024,
          "urf": 869147
        }
      },
      "support": {
        "samples": {
          "normal": 120103,
          "urf": 6578
        },
        "wins": {
          "normal": 58915,
          "urf": 2810
        },
        "kills": {
          "normal": 234373,
          "urf": 28813
        }
      }
    };
    $scope.clusterItems = {
      'ad' : [3006, 3031, 3072, 3087, 3153],
      'ap' : [3157, 3135, 3089, 3027, 3020],
      'fighter': [3071, 3074, 3134, 3707, 3035],
      'support': [2049, 3069, 3092, 3190, 3401],
      'tank': [3709, 3083, 3065, 3068, 3143]
    };
    $scope.roles = stylenames;
    $scope.champions = c.champions;
  });
});

urfControllers.controller('ChampionListCtrl', function($scope, championService) {
  $scope.champions = [];
  championService.load(function(c) {
    $scope.champions = c.champions;
  });
});

urfControllers.controller('ChampionDetailCtrl', function($scope, $routeParams, championService) {
  championService.load(function(c) {
    $scope.roles = stylenames;
    for (var i in c.champions) {
      if (c.champions[i].key == $routeParams.champion) {
        $scope.champion = c.champions[i];
        break;
      }
    }
    var data = {
      normal : [['Role', 'Percentage']],
      urf: [['Role', 'Percentage']]
    }
    for (var i in stylenames) {
      data.normal.push([stylenames[i], 0.00001 + $scope.champion.stats[i].samples.normal / $scope.champion.stats.total.samples.normal]);
      data.urf.push([stylenames[i], 0.00001 + $scope.champion.stats[i].samples.urf / $scope.champion.stats.total.samples.urf]);
    }
    
    var options = {
      backgroundColor: 'transparent', sliceVisibilityThreshold: 0,
      colors: ['#F44', '#96F', '#DC4', '#3CF', '#ABB'], legend: {textStyle: {color: '#FFF'}},
      chartArea: {width: '85%', height: '80%'},
    };
    var chartDiff = new google.visualization.PieChart(document.getElementById('champion-piechart'));
    var diffData = chartDiff.computeDiff(google.visualization.arrayToDataTable(data.normal), google.visualization.arrayToDataTable(data.urf));
    chartDiff.draw(diffData, options);
  });
});

urfControllers.controller('SummaryCtrl', function ($scope, $http, championService) {
  var chartdatanormal = [];
  var chartdataurf = [];
  var tabledata = [];
  var champions = [];
  var samples = {
    normal: 0,
    urf: 0
  };
  $scope.roles = stylenames; 
  $scope.summaryChartShowing = 'urf';
  $scope.summaryModes = {
    'urf' : 'URF', 'normal' : 'Normal'
  }
  var summaryChartData = {};
  var summaryChartShowing = 'urf';

  $scope.summaryChartMarkers = function(chartWrapper) {
    var dataTable = summaryChartData[$scope.summaryChartShowing];
    var cli = chartWrapper.getChart().getChartLayoutInterface();
    var chartArea = cli.getChartAreaBoundingBox();
    for (var i in $scope.champions) {
      $scope.champions[i].chartClass = 'chart-champion-' + $scope.champions[i]['primary' + $scope.summaryChartShowing];
      $scope.champions[i].chartStyles = {
        top : Math.floor(cli.getYLocation(dataTable.getValue(parseInt(i), 1))) - 10 + "px",
        left : Math.floor(cli.getXLocation(dataTable.getValue(parseInt(i), 0))) - 10 + "px"
      }
    }
  }

  var drawSummaryChart = function() {
    summaryChartData.normal = new google.visualization.DataTable();
    summaryChartData.normal.addColumn('number', 'Pick Rate');
    summaryChartData.normal.addColumn('number', 'Win Rate');
    summaryChartData.normal.addColumn({type: 'string', role: 'tooltip'});
    summaryChartData.normal.addRows(chartdatanormal);

    summaryChartData.urf = new google.visualization.DataTable();
    summaryChartData.urf.addColumn('number', 'Pick Rate');
    summaryChartData.urf.addColumn('number', 'Win Rate');
    summaryChartData.urf.addColumn({type: 'string', role: 'tooltip'});
    summaryChartData.urf.addRows(chartdataurf);
    
    $scope.summaryChart = {
      type: "ScatterChart",
      data: summaryChartData.urf,
      options: {
        hAxis: {
          title: 'Pick Rate', minValue: 0, maxValue: 0.5, format:'#.##%',
          gridlines: {count: 16}, titleTextStyle: {color: '#0CE3AC'}, textStyle: {color: '#FFF'},
          logScale: true,
          ticks: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.2, 0.3, 0.4, 0.5]
        },
        vAxis: {
          title: 'Win Rate', minValue: 0.38, maxValue: 0.58, format:'#.##%',
          gridlines: {count: 11}, titleTextStyle: {color: '#0CE3AC'}, textStyle: {color: '#FFF'}
        },
        legend: 'none',
        chartArea: {width: '85%', height: '80%'},
        backgroundColor: 'transparent',
        tooltip : {trigger: 'none'},
        dataOpacity: 0
      }
    };
  }
  var redrawSummaryChart = function() {
    $scope.summaryChart['data'] = summaryChartData[chartShowing];
    placeMarkers();
  }
  var drawSummaryTable = function() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Champion');
    data.addColumn('string', '');
    data.addColumn('number', 'Pick Rate<br>Normal');
    data.addColumn('number', 'URF');
    data.addColumn('number', 'Win Rate<br>Normal');
    data.addColumn('number', 'URF');
    data.addColumn('number', 'Avg Kills<br>Normal');
    data.addColumn('number', 'URF');
    data.addColumn('string', 'Primary Role<br>Normal');
    data.addColumn('string', 'URF');
    data.addRows(tabledata);

    $scope.summaryTable = {
      type: "Table",
      data: data,
      options: {
        showRowNumber: false,
        alternatingRowStyle: false,
        allowHtml: true,
        cssClassNames : {
          headerRow: 'summary-head',
          hoverTableRow : 'summary-row-hover',
          selectedTableRow :'summary-row-hover',
          tableRow: 'summary-row',
          tableCell : 'summary-cell'
        }
      },
      className: 'table table-striped'
    }
  };
  $scope.summaryTableSetClasses = function() {
    angular.element(document.querySelector('#summary-table table')).addClass('table').addClass('table-striped').removeClass('google-visualization-table-table');
  }

  $scope.champions = [];
  championService.load(function(c) {

    $scope.champions = c.champions;
    samples = c.samples;

    for (var i in $scope.champions) {
      $scope.champions[i].chartClass = 'chart-champion-' + $scope.champions[i]['primary' + $scope.summaryChartShowing];
      $scope.champions[i].chartStyles = {}
    }
    var rows = [];

    for (var i in $scope.champions) {
      var s = styletext($scope.champions[i].primarynormal);
      var t = '';
      if ($scope.champions[i].primaryurf != $scope.champions[i].primarynormal) {
        t = '<span class="glyphicon glyphicon-triangle-right style-change" aria-hidden="true"></span>' + styletext($scope.champions[i].primaryurf);
      }
      chartdatanormal.push([$scope.champions[i].normalpick, $scope.champions[i].normalwin, $scope.champions[i].name]);
      chartdataurf.push([$scope.champions[i].urfpick, $scope.champions[i].urfwin, $scope.champions[i].name]);
      tabledata.push([
        {v: $scope.champions[i].name, f: '<a href="#champion/' + $scope.champions[i].key + '">' + $scope.champions[i].name + '</a>'},
        '<img src="http://ddragon.leagueoflegends.com/cdn/5.7.1/img/champion/' + $scope.champions[i]['key'] + '.png" class="champion-square">',
        {v: $scope.champions[i].normalpick, f: percentage($scope.champions[i].normalpick)},
        {v: $scope.champions[i].urfpick, f: changeicon($scope.champions[i].normalpick - $scope.champions[i].urfpick) + percentage($scope.champions[i].urfpick)},
        {v: $scope.champions[i].normalwin, f: percentage($scope.champions[i].normalwin)},
        {v: $scope.champions[i].urfwin, f: changeicon($scope.champions[i].normalwin - $scope.champions[i].urfwin) + percentage($scope.champions[i].urfwin)},
        {v: $scope.champions[i].normalkills, f: '<span class="avgkills">' + $scope.champions[i].normalkills.toFixed(2) + '</span>'},
        {v: $scope.champions[i].urfkills, f: changeicon($scope.champions[i].normalkills - $scope.champions[i].urfkills) + '<span class="avgkills">' + $scope.champions[i].urfkills.toFixed(2) + '<span>'},
        {v: $scope.champions[i].primarynormal, f: s},
        {v: $scope.champions[i].primaryurf, f: t}
      ]);
    }

    drawSummaryChart();
    drawSummaryTable();
  });

  $scope.summaryChartSwitch = function() {
    $scope.summaryChartShowing = $scope.summaryChartShowing == 'urf' ? 'normal' : 'urf';
    $scope.summaryChart.data = summaryChartData[$scope.summaryChartShowing];
  }
});
