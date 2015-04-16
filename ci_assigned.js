var fs = require('fs');
var readline = require('readline');
 
var championdata = JSON.parse(fs.readFileSync('champions.json')).data;

for (var c in championdata) {
  championdata[c].stats = {
    total: {
      samples: {normal: 0, urf: 0},
      wins: {normal: 0, urf: 0},
      kills: {normal: 0, urf: 0},
    },
    ad: {
      samples: {normal: 0, urf: 0},
      wins: {normal: 0, urf: 0},
      kills: {normal: 0, urf: 0},
    },
    ap: {
      samples: {normal: 0, urf: 0},
      wins: {normal: 0, urf: 0},
      kills: {normal: 0, urf: 0},
    },
    fighter: {
      samples: {normal: 0, urf: 0},
      wins: {normal: 0, urf: 0},
      kills: {normal: 0, urf: 0},
    },
    tank: {
      samples: {normal: 0, urf: 0},
      wins: {normal: 0, urf: 0},
      kills: {normal: 0, urf: 0},
    },
    support: {
      samples: {normal: 0, urf: 0},
      wins: {normal: 0, urf: 0},
      kills: {normal: 0, urf: 0},
    }
  }
}
var groupname = ['ad', 'ap', 'fighter', 'support', 'tank'];

var data = fs.readFileSync('assigned_normal.csv', {encoding: 'utf8'}).split(/\n/);

for (var i = 1; i < data.length; i++) {
  var values = data[i].trim().split(/,/);
  if (values.length < 10) continue;
  if (!values[values.length - 1]) continue;
  championdata[values[0]].stats[groupname[parseInt(values[values.length - 1])]].samples.normal++;
  championdata[values[0]].stats['total'].samples.normal++;
  championdata[values[0]].stats[groupname[parseInt(values[values.length - 1])]].wins.normal += (values[1] == 'True' ? 1 : 0);
  championdata[values[0]].stats['total'].wins.normal += (values[1] == 'True' ? 1 : 0);
  championdata[values[0]].stats[groupname[parseInt(values[values.length - 1])]].kills.normal += parseInt(values[2]);
  championdata[values[0]].stats['total'].kills.normal += parseInt(values[2]);
  if (i % 1000 == 0) {
    console.log(i + ' / ' + data.length);
  }
}
var i = 0;
var rd = readline.createInterface({
    input: fs.createReadStream('assigned_urf.csv'),
    output: process.stdout,
    terminal: false
});

rd.on('line', function(line) {
  var values = line.trim().split(/,/);
  if (values[0] == 'Champion') return ;
  if (values.length < 10) return ;
  if (!values[values.length - 1]) return ;
  championdata[values[0]].stats[groupname[parseInt(values[values.length - 1])]].samples.urf++;
  championdata[values[0]].stats['total'].samples.urf++;
  championdata[values[0]].stats[groupname[parseInt(values[values.length - 1])]].wins.urf += (values[1] == 'True' ? 1 : 0);
  championdata[values[0]].stats['total'].wins.urf += (values[1] == 'True' ? 1 : 0);
  championdata[values[0]].stats[groupname[parseInt(values[values.length - 1])]].kills.urf += parseInt(values[2]);
  championdata[values[0]].stats['total'].kills.urf += parseInt(values[2]);
  i++;
  if (i % 1000 == 0) {
    console.log(i);
  }
}).on('close', function(){
  fs.writeFileSync('champion_stats.json', JSON.stringify(championdata));
});

