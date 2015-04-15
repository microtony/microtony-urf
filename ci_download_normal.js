var fs = require('fs');
var https = require('https');

var apikey = fs.readFileSync('apikey.txt');

var users = fs.readdirSync('E:\\urf\\normal_users');
var items = JSON.parse(fs.readFileSync('items_filtered.json'));

var data = [];
var count = 0;

var q = [];
for (var i in users) {
  try {
    var games = JSON.parse(fs.readFileSync('E:\\urf\\normal_users\\' + users[i])).games;
  } catch (e) {
    continue;
  }
  for (var k in games) {
    var match = games[k];
    if (match.mapId != 11) continue;
    if (match.createDate < 1427932800) continue;
    if (match.subType != "NORMAL" && match.subType != "RANKED_SOLO_5x5") continue;
    if (match.gameType != "MATCHED_GAME") continue;
    if (match.invalid) continue;
    q.push(match.gameId);
  }
  if (i % 100 == 0) {
    console.log(i + ' ' + users.length + ': ' + q.length);
  }
}

var f = function(i) {
  while (fs.existsSync('E:/urf/normal/na_'+ q[i] + '.json')) {
    i++;
  }
  console.log('Getting ' + q[i]);
  https.request({
    host : "na.api.pvp.net",
    path : "/api/lol/na/v2.2/match/" + q[i] + "?api_key=" + apikey
  }, function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      try {
        var match = JSON.parse(str);
      } catch (e) {
        return ;
      }
      fs.writeFileSync('E:/urf/normal/na_'+ q[i] + '.json', str);
      count++;
    });
    
  }).on('error', function(e){
    console.log(e)
  }).end();
  setTimeout(function() {
    f(i + 1);
  }, 1200);
};
 
f(0);

fs.writeFileSync('champion_items_normal.json', JSON.stringify(data));
  