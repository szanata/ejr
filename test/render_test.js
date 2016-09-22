var 
  should = require('chai').should(),
  ejr = require('../ejr');

describe('Rendering a json file', function () {
  
  it('Should interpolated the context var in the file', function (done) {

    ejr('./test/test_file.json', { myCar: { color: "green" } }, function (err, render) {
      var renderdJSON = JSON.parse(render);
      renderdJSON.color.should.be.equals("green");
      done();
    })
    
  });

});
