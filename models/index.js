// var fs = require('fs');
// var path = require('path');
// var db = {};

// fs.readdirSync(__dirname)
//   .filter(function(file) {
//     return (file.indexOf(".") !== 0) && (file !== "index.js");
//   })
//   .forEach(function(file) {
//     var modelDir = path.join(__dirname, file);
//     console.log(modelDir);
//     db[capitalizeFirstLetter(path.basename(modelDir, '.js'))] = modelDir;
//     //console.log(db);
//   });

// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }

// module.exports = db;