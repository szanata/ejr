const fs = require('fs');
const vm = require("vm");

module.exports = function (filePath, options, callback) {
  
  fs.readFile(filePath, (err, fileContent) => {
    
    if (err) { return callback( new Error(err) ); }
    
    var content = fileContent.toString();
    var wrapped = `var render = ${content}`;
    var ctx = options;
    
    vm.runInNewContext(wrapped, ctx);
    
    return callback(null, JSON.stringify(ctx.render));
  });
  
};
