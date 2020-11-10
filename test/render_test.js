const should = require( 'chai' ).should();
// const expect = require( 'chai' ).expect;
const ejr = require( '../ejr' );

describe( 'Rendering a json file', function () {
  
  it( 'Should interpolated the context var in the file', async () => {
    const result = await ejr( './test_files/car.json', { myCar: { color: "green" } } );
    JSON.parse( result ).color.should.be.equals( 'green' );
  } );

  it( 'Should include subfile in the final rander', async () => {
    const context = {
      myCar: {
        color: "green",
        engine: {
          cylinders: 6,
          displacement: 2,
          output: 288
        }
      }
    };
    const result = await ejr( './test_files/car_with_engine.json', context );
    JSON.parse( result ).should.deep.equals( context.myCar );
  } );
  
  it( 'Should render file with require code', async () => {
    const result = await ejr( './test_files/test_require.json', { } );
    JSON.parse( result ).path.should.be.equals( 'value' );
  } );
  
  it( 'Should not keep options on included subfile', async () => {
    const result = await ejr( './test_files/test_include.json', { variable: "value" } );
    JSON.parse( result ).variable.should.equals( 'value' );
  } );

  describe( 'Interdependency test', async () => {
    it( 'The root path (base file for reference) should always be relative to the location of the original view', async () => {
      const pies = [
        {
          flavor: 'vanilla',
          toppings: [{
            flavor: 'chocolate',
            amount: '2oz'
          }, {
            flavor: 'cherry',
            amount: '1oz'
          } ]
        },
        {
          flavor: 'cream',
          toppings: [{
            flavor: 'strawberry',
            amount: '2oz'
          }, {
            flavor: 'mango',
            amount: '2oz'
          }]
        }
      ]
      const result = await ejr( './test_files/interdependency/pie/list.json', { pies } );

      const renderdJSON = JSON.parse( result );

      renderdJSON.pies.length.should.eql( 2 );
      renderdJSON.pies[0].pie.flavor.should.eql( 'vanilla' );
      renderdJSON.pies[0].pie.toppings[0].topping.flavor.should.eql( 'chocolate' );
      renderdJSON.pies[1].pie.flavor.should.eql( 'cream' );
      renderdJSON.pies[1].pie.toppings[0].topping.flavor.should.eql( 'strawberry' );
    } );
  } );
});
