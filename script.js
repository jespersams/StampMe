var fs = require('fs');
var files = fs.readdirSync('stamps/');
fs.writeFile("stampArray.json", JSON.stringify(files));