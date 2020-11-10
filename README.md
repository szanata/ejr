# ejr
*Easy JSON Render view engine for express.js*

This view engine allows to easy render json responses outside controllers, direct in the views path, as .json files, interpolating context variables

### 1. Install & configure

`npm install -S ejr`

```js
// in the app.js or any other main file you have

// express defaults
const express = require( 'express' );
const app = express();
const ejr = require( 'ejr' ); // require ejr

// than configure view engine
app.engine( 'json', ejr );
app.set( 'view engine', 'json' );
```

**Important**: This will cause all `.json` files to be interpreted by the engine, with no side effects. But you can set just `.ejr` files to be interpreted by doing:

```js
// than configure view engine
app.engine( 'ejr', ejr );
app.set( 'view engine', 'ejr' );
```

And then on views path use *.ejr* files instead of *.json*.

### 2. Setup the route response to render json and point to the json/ejr file

```js
app.get('someroute', ( req, res ) => {
  const context = { car: { color: "red" } }; // your data
  res.type( 'json' ).render( 'views/car', context ); // like the default render method with express
} );
```

### 3. Setup the mapping in the view files
```js
// car.json
{
  "color": car.color
}
```

The view files must be either a `.json` or `.ejr` according to the config in the #1 item.
Both are json files that can interpolate global variables inside.

### Output

When  `GET /some-route` respond it will return:
```js
{
  "color": "red"
}
```

### Including partial files:

To include other files in the final render use the `_include` function:
```js
// car.json

{
  "color": car.color
  "engine": _include( './engine.json' , { engine: car.engine } )
}
```

```js
// engine.json
{
  "cylinders": engine.cylinders,
  "displacement": engine.displacement,
  "output": engine.output  
}
```

The output will be a combination of the two files
```js
{
  "color": "red",
  "engine": {
    "cylinders": 6,
    "displacement": 2,
    "output": 288
  }
}
```

The function signature is `_include( file, context )`: The *file* is the partial path, and the *context* is any variables used inside the partial.

**Important**: The included file path must be relative to the view where the `_include` fn was called;

### More complex conde

This engine is very simple, the purpose is to render **json** files interpolating context variables, and this is done using the **vm** module from node.
As all code is evaluated as pure Javascript, you can add some logic in the output with lambdas, like this:

```js
// myfile.json

{
  "collection": ( () => {
    const array = [];
    for (let i = 0; i < 10; i++) {
      array.push( i );
    }
    return array;
  } )()
}
```

will result in:

```js
// myfile.json

{
  "collection": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
}
```

### Changelog

- **1.0.0**: Updating syntax to latest Node version. ejr nows works as both classic callback function and promise.

- **0.0.7**: Fixed: Options and context from first file are bound to the context of any `_include`.

- **0.0.6**: Fixed: relative path for `_include` inside `_include` from a outside folder.

- **0.0.5**: Fixed: relative path for `_include` inside `_include`.

- **0.0.4**: Options and context from first file are bound to the context of any `_include`. **Feature removed on v0.0.6**.

- **0.0.3**: You can use `console`, `require` and `process` inside the view.
