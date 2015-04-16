var fs = require('fs');

var matches = fs.readdirSync('E:\\urf\\normal');
var items = JSON.parse(fs.readFileSync('items_adjusted.json'));

var data = [];
var count = 0;
for (var i in matches) {
  try {
    var match = JSON.parse(fs.readFileSync('E:\\urf\\normal\\' + matches[i]));
  } catch (e) {
    continue;
  }
  if (match.mapId != 11) continue;
  if (match.participants.length != 10) continue;
  for (var j = 0; j < 10; j++) {
    var t = {};
    t.champion = match.participants[j].championId;
    t.items = [];
    t.totalgold = 0;
    for (var k = 0; k <= 6; k++) {
      if (match.participants[j].stats['item' + k] && items[match.participants[j].stats['item' + k]]) {
        if (items[match.participants[j].stats['item' + k]].mapto) {
          t.items.push(items[match.participants[j].stats['item' + k]].mapto);
        } else {
          t.items.push(match.participants[j].stats['item' + k]);
        }
        t.totalgold += items[match.participants[j].stats['item' + k]].gold;
      }
    }
    t.kills = match.participants[j].stats.kills;
    t.winner = match.participants[j].stats.winner;
    data.push(t);
  }
  if (count % 100 == 0) {
    console.log(count + ' ' + matches.length);
  }
  count++;
}

fs.writeFileSync('champion_items_normal.json', JSON.stringify(data));
  