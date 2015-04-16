var urfControllers = angular.module('urfControllers', ['googlechart']);

urfControllers.controller('SummaryCtrl', function ($scope, $http, championService) {
  var chartdatanormal = [];
  var chartdataurf = [];
  var tabledata = [];
  var champions = [];
  var samples = {
    normal: 0,
    urf: 0
  };
  var stylenames = {
    'ad': 'Marksman',
    'ap': 'Mage',
    'fighter': 'Fighter',
    'tank': 'Tank',
    'support': 'Support'
  };
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
          title: 'Win Rate', minValue: 0.4, maxValue: 0.58, format:'#.##%',
          gridlines: {count: 10}, titleTextStyle: {color: '#0CE3AC'}, textStyle: {color: '#FFF'}
        },
        legend: 'none',
        chartArea: {width: '90%', height: '80%'},
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
  var percentage = function(v) {
    return '<span class="percentage">' + (v * 100).toFixed(2) + '%</span>';
  }
  var changeicon = function(v) {
    if (v < 0) {
      return '<span class="glyphicon glyphicon-triangle-top stats-increase" aria-hidden="true"></span>';
    }
    return '<span class="glyphicon glyphicon-triangle-bottom stats-decrease" aria-hidden="true"></span>';
  }
  var styletext = function(v) {
    return '<span class="styletext-' + v + '">' + stylenames[v] + '</span>';
  }

  $scope.champions = [];
  championService.load(function(c) {
    /*for (var i in c) {
      samples.normal += c[i].stats.total.samples.normal;
      samples.urf += c[i].stats.total.samples.urf;
      $scope.champions.push(c[i]);
    }
    $scope.champions.sort(function(a, b) {
      if (a.name < b.name) return -1;
      return a.name == b.name ? 0 : 1;
    });*/

    $scope.champions = c.champions;
    samples = c.samples;

    var rows = [];

    for (var i in $scope.champions) {
      var normalpick = 10 * $scope.champions[i].stats.total.samples.normal / samples.normal;
      var normalwin = $scope.champions[i].stats.total.wins.normal / $scope.champions[i].stats.total.samples.normal;
      var urfpick = 10 * $scope.champions[i].stats.total.samples.urf / samples.urf;
      var urfwin = $scope.champions[i].stats.total.wins.urf / $scope.champions[i].stats.total.samples.urf;

      $scope.champions[i].primarynormal = 'ad';
      for (var j in {'ap':0, 'fighter':0, 'tank':0, 'support':0}) {
        if ($scope.champions[i].stats[j].samples.normal > $scope.champions[i].stats[$scope.champions[i].primarynormal].samples.normal) {
          $scope.champions[i].primarynormal = j;
        }
      }
      $scope.champions[i].primaryurf = 'ad';
      for (var j in {'ap':0, 'fighter':0, 'tank':0, 'support':0}) {
        if ($scope.champions[i].stats[j].samples.urf > $scope.champions[i].stats[$scope.champions[i].primaryurf].samples.urf) {
          $scope.champions[i].primaryurf = j;
        }
      }
      var s = styletext($scope.champions[i].primarynormal);
      var t = '';
      if ($scope.champions[i].primaryurf != $scope.champions[i].primarynormal) {
        t = '<span class="glyphicon glyphicon-triangle-right style-change" aria-hidden="true"></span>' + styletext($scope.champions[i].primaryurf);
      }
      chartdatanormal.push([normalpick, normalwin, $scope.champions[i].name]);
      chartdataurf.push([urfpick, urfwin, $scope.champions[i].name]);
      tabledata.push([
        $scope.champions[i].name,
        '<img src="http://ddragon.leagueoflegends.com/cdn/5.7.1/img/champion/' + $scope.champions[i]['key'] + '.png" class="champion-square">',
        {v: normalpick, f: percentage(normalpick)},
        {v: urfpick, f: changeicon(normalpick - urfpick) + percentage(urfpick)},
        {v: normalwin, f: percentage(normalwin)},
        {v: urfwin, f: changeicon(normalwin - urfwin) + percentage(urfwin)},
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
