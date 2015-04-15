var fs = require('fs');

var championitems = JSON.parse(fs.readFileSync('champion_items_normal.json'));
var items = JSON.parse(fs.readFileSync('items_adjusted.json'));
var championdata = JSON.parse(fs.readFileSync('champions.json')).data;

var sum = 0;
for (var ci in championitems) {
  sum += championitems[ci].totalgold;
}

//var avg = sum / championitems.length;
var avg = 15000;
var champions = {};
var t = [];
var rev = {};
//var files = {};
for (var c in championdata) {
  champions[championdata[c].id] = c;
  //files[c] = [];
}
var allrows = [];

var s = 'Champion,Win';
for (var i in items) {
  if (items[i].mapto) continue;
  rev[i] = t.length;
  t.push(0);
  s += ',' + i;
}

for (var ci in championitems) {
  var scale = avg / championitems[ci].totalgold;
  var c = championitems[ci].champion;
  var j = t.slice(0);
  for (var i in championitems[ci].items) {
    var it = rev[championitems[ci].items[i]];
    j[it] += scale * items[championitems[ci].items[i]].gold;
    if (championitems[ci].items >= 3707 && championitems[ci].items <= 3726) {
      j[rev[1039]] += scale * items[championitems[ci].items[i]].gold;
    }
  }
  //files[champions[c]].push(champions[c] + ',' + championitems[ci].winner + ',' + j.join(','));
  allrows.push(champions[c] + ',' + championitems[ci].winner + ',' + j.join(','));
}
fs.open('rows_normal.csv', 'w', 0666, function(err, fd){
  fs.writeSync(fd, s + '\n');
  for (var i in allrows) {
    fs.writeSync(fd, allrows[i] + '\n');
  }
  fs.closeSync(fd);
});