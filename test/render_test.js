var 
  should = require('chai').should(),
  ejr = require('../ejr');

describe('Rendering a json file', function () {
  
  it('Should interpolated the context var in the file', function (done) {
  
    ejr('./test_files/car.json', { myCar: { color: "green" } }, function (err, render) {
      var renderdJSON = JSON.parse(render);
      renderdJSON.color.should.be.equals("green");
      done();
    });
  });
  
  it('Should include subfile in the final rander', function (done) {

    ejr('./test_files/car_with_engine.json', { myCar: { color: "green", engine: { cylinders: 6, displacement: 2, output: 288 } } }, function (err, render) {
      var renderdJSON = JSON.parse(render);
      renderdJSON.color.should.be.equals("green");
      JSON.stringify(renderdJSON.engine).should.be.equals(JSON.stringify({ cylinders: 6, displacement: 2, output: 288 }));
      done();
    });
  });
  
  it('Should render file with require code', function (done) {

    ejr('./test_files/test_require.json', { }, function (err, render) {
      var renderdJSON = JSON.parse(render);
      renderdJSON.path.should.be.equals("value");
      done();
    });
  });
  
  it('Should keep context on included subfile', function (done) {
    ejr('./test_files/test_include.json', { variable: "value" }, function (err, render) {

      var renderdJSON = JSON.parse(render);
      renderdJSON.variable.should.be.equals("value");
      done();
    });
  });

});
