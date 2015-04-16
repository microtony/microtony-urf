google.load("visualization", '1.1', {packages:['corechart', 'table']});
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
var chart;
var chartData = {};
var chartShowing = 'urf';
var chartOptions = {
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
};
var placeMarkers = function() {
  var dataTable = chartData[chartShowing];
  var cli = this.getChartLayoutInterface();
  var chartArea = cli.getChartAreaBoundingBox();
  for (var i in champions) {
    var img = $('#chart-champion-' + champions[i]['key']);
    if (img.size() == 0) {
      img = $('<div id="chart-champion-' + champions[i]['key'] + '" class="chart-champion"><img src="http://ddragon.leagueoflegends.com/cdn/5.7.1/img/champion/' + champions[i]['key'] + '.png"></div>');
      $('#chart-summary').append(img);
      img.addClass('chart-champion-' + champions[i]['primary' + chartShowing]);
      img.css({
        top : Math.floor(cli.getYLocation(dataTable.getValue(parseInt(i), 1))) - 10 + "px",
        left : Math.floor(cli.getXLocation(dataTable.getValue(parseInt(i), 0))) - 10 + "px"
      });
    } else {
      img.removeClass('chart-champion-' + champions[i]['primary' + (chartShowing == 'urf' ? 'normal' : 'urf')]);
      img.addClass('chart-champion-' + champions[i]['primary' + chartShowing]);
      img.animate({
        top : Math.floor(cli.getYLocation(dataTable.getValue(parseInt(i), 1))) - 10 + "px",
        left : Math.floor(cli.getXLocation(dataTable.getValue(parseInt(i), 0))) - 10 + "px"
      }, 3000);
    }
    
  }
}

var drawSummaryChart = function() {
  chartData.normal = new google.visualization.DataTable();
  chartData.normal.addColumn('number', 'Pick Rate');
  chartData.normal.addColumn('number', 'Win Rate');
  chartData.normal.addColumn({type: 'string', role: 'tooltip'});
  chartData.normal.addRows(chartdatanormal);

  chartData.urf =new google.visualization.DataTable();
  chartData.urf.addColumn('number', 'Pick Rate');
  chartData.urf.addColumn('number', 'Win Rate');
  chartData.urf.addColumn({type: 'string', role: 'tooltip'});
  chartData.urf.addRows(chartdataurf);
  
  chart = new google.visualization.ScatterChart(document.getElementById('chart-summary'));
  google.visualization.events.addListener(chart, 'ready', placeMarkers.bind(chart));
  redrawSummaryChart();
}
var redrawSummaryChart = function() {
  chart.draw(chartData[chartShowing], chartOptions);
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

  var table = new google.visualization.Table(document.getElementById('summary-table'));
  var options = {
    showRowNumber: false,
    alternatingRowStyle: false,
    allowHtml: true,
    cssClassNames : {
      headerRow: 'summary-head',
      hoverTableRow : 'summary-row-hover',
      selectedTableRow :'summary-row-hover',
      tableRow: 'summary-row',
      tableCell : 'summary-cell'
    },
    className: 'table table-striped'
  };
  table.draw(data, options);
  $('#summary-table table').addClass('table').addClass('table-striped').removeClass('google-visualization-table-table');
}
var drawSummary = function() {
  drawSummaryChart();
  drawSummaryTable();
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
$.get('champion_stats.json', function(c) {
  for (var i in c) {
    samples.normal += c[i].stats.total.samples.normal;
    samples.urf += c[i].stats.total.samples.urf;
    champions.push(c[i]);
  }
  champions.sort(function(a, b) {
    if (a.name < b.name) return -1;
    return a.name == b.name ? 0 : 1;
  });
  var rows = [];
  for (var i in champions) {

    var normalpick = 10 * champions[i].stats.total.samples.normal / samples.normal;
    var normalwin = champions[i].stats.total.wins.normal / champions[i].stats.total.samples.normal;
    var urfpick = 10 * champions[i].stats.total.samples.urf / samples.urf;
    var urfwin = champions[i].stats.total.wins.urf / champions[i].stats.total.samples.urf;

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
    var s = styletext(champions[i].primarynormal);
    var t = '';
    if (champions[i].primaryurf != champions[i].primarynormal) {
      t = '<span class="glyphicon glyphicon-triangle-right style-change" aria-hidden="true"></span>' + styletext(champions[i].primaryurf);
    }
    chartdatanormal.push([normalpick, normalwin, champions[i].name]);
    chartdataurf.push([urfpick, urfwin, champions[i].name]);
    tabledata.push([
      champions[i].name,
      '<img src="http://ddragon.leagueoflegends.com/cdn/5.7.1/img/champion/' + champions[i]['key'] + '.png" class="champion-square">',
      {v: normalpick, f: percentage(normalpick)},
      {v: urfpick, f: changeicon(normalpick - urfpick) + percentage(urfpick)},
      {v: normalwin, f: percentage(normalwin)},
      {v: urfwin, f: changeicon(normalwin - urfwin) + percentage(urfwin)},
      {v: champions[i].primarynormal, f: s},
      {v: champions[i].primaryurf, f: t}
    ]);
  }
  //$('#summary-table').empty();
  //$('#summary-table').append(rows);
  google.setOnLoadCallback(drawSummary);

  $('#chart-button button').click(function() {
    $('#chart-button button').html(chartShowing == 'urf' ? 'Displaying: Normal' : 'Displaying: URF');
    chartShowing = chartShowing == 'urf' ? 'normal' : 'urf';
    redrawSummaryChart();
  });

});

