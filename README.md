# ejr
*Easy JSON Render view engine for express.js*

This view engine allows to easy render json responses outside controllers, direct in the views path, as .json files, interpolating context variables

### 1. Install & configure

`npm install --save ejr`

```js
// in app.js or any other main file you have

// express defaults
const express = require('express');
const app = express();
const ejr = require('ejr'); // require ejr

// than configure view engine
app.engine('json', ejr);
app.set('view engine', 'json');
```

### 2. Using in controllers

```js
app.get('someroute', (req, res) => {
  var context = { car: { color: "red" } };
  res.type( 'json' ).render( 'views/car', context ); // like the default render method with express
});
```

### 3. Setting the view
```js
// car.json

{
  "color": car.color
}

```

### Output

When doing `GET /some-route`, the response will be:
```js
{
  "color": "red"
}
```

### Including partial files:

To include another files in the final render (like partials) use the `_include` function:
```js
// car.json

{
  "color": car.color
  "engine": _include('./engine.json', { engine: car.engine } )
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
The function signature is `_include(file, context)`: The *file* is the partial path, and the *context* is any variables used inside the partial.

**Important**: The included file path must be relative to the view where the `_include` fn was called;

### Notes


- If you don't want to all .json files be interpreted by this engine, you can change the extension the anything, like *.ejr*, doing this:

```js
// in app.js or any other main file you have

// than configure view engine
app.engine('ejr', ejr);
app.set('view engine', 'ejr');
```

And than on views path, use *.ejr* files instead of *.json*.

- This engine is very simple, the purpose is to simple render json files interpolating context variables, and this is done using the **vm** module from node.
As any code is evalutated as js, you can add some logic in the output with lambdas, like this:

```js
// myfile.json

{
  "collection":
  (function () {
    
    var array = [];
    for (let i = 0; i < 10; i++) {
      array.push(i);
    }
    return array;
  })()
  
}
```

will result in

```js
// myfile.json

{
  "collection": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}
```

This is just a dump example, but anything is possible.
