var fs = require('fs');

var championitems = JSON.parse(fs.readFileSync('champion_items_normal.json'));
var items = JSON.parse(fs.readFileSync('items_adjusted.json'));
var championdata = JSON.parse(fs.readFileSync('champions.json')).data;

var sum = 0;
for (var ci in championitems) {
  sum += championitems[ci].totalgold;
}
console.log(sum);
console.log(sum / championitems.length);

//var avg = sum / championitems.length;
var avg = 15000;
var champions = {};
for (var c in championdata) {
  var t = {};
  t.count = 0;
  t.name = c;
  t.itemcounts = {};
  t.totalgold = 0;
  for (var i in items) {
    if (items[i].mapto) continue;
    t.itemcounts[i] = 0;
  }
  champions[championdata[c].id] = t;
}

for (var ci in championitems) {
  var scale = avg / championitems[ci].totalgold;
  var c = championitems[ci].champion;
  //console.log(champions[c]);
  champions[c].count++;
  champions[c].totalgold += championitems[ci].totalgold;
  for (var i in championitems[ci].items) {
    var it = championitems[ci].items[i];
    champions[c].itemcounts[it] += scale;
    if (it >= 3707 && it <= 3726) {
      champions[c].itemcounts[1039] += scale;
    }
  }
}

fs.writeFileSync('champions_aggregated_normal.json', JSON.stringify(champions));

var s = 'Champion,Count,AvgGold';
var itemnames = '';
for (var i in items) {
  if (items[i].mapto) continue;
  s += ',' + i;
  itemnames += items[i].name + '\n';
}
s += '\n';
for (var c in champions) {
  s += champions[c].name + ',' + champions[c].count + ',' + champions[c].totalgold / champions[c].count;
  for (var i in items) {
    if (items[i].mapto) continue;
    s += ',' + champions[c].itemcounts[i] / champions[c].count * items[i].gold;
  }
  s += '\n';
}
fs.writeFileSync('champions_aggregated_normal.csv', s);
//fs.writeFileSync('itemnames.txt', itemnames);
