# SVG segmentize

[![Build Status](https://travis-ci.org/robbykraft/svg-segmentize.svg?branch=master)](https://travis-ci.org/robbykraft/svg-segmentize)

this converts an SVG image into a copy containing only (straight) line segments.

*see an [example here](https://robbykraft.github.io/svg-segmentize/test/) segmented image is on the right*

works with every shape in the SVG 1.1 specification:

- line
- rect
- circle
- ellipse
- polygon
- polyline
- path

all attributes from the original geometry are carried over and applied to the corresponding line(s). you'll notice that:

- fills disappear (there are no closed shapes anymore)
- dashed lines are no longer visible on curves (curves are now collections of very short lines)

## usage

web

```javascript
let lineSegments = Segmentize(input, options);
```

node

```javascript
const Segmentize = require("svg-segmentize");

let lineSegments = Segmentize(input, options);
```

### arguments (2):

- **input** is an SVG either as a *string* or an *SVGElement*.
- options is a *Javascript object*, and is optional. 

### options

```javascript
DEFAULTS = {
  input: "string",
  output: "string",
  resolution: {
    circle: 64,
    ellipse: 64,
    path: 128
  }
};
```

- **options.input**: "string" / "svg"
- **options.output**: "string" / "svg" / "data"
- **options.resolution**: *how many line segments do curve-types become?*

the "data" output option exports an array of line segments, endpoints in this order: `[x1, y1, x2, y2]`

```javascript
[
  [0, 0, 10, 10, {}],
  [50, 40, 100, 150, {}],
  ...
]
```

the fifth entry for every line segment is an object. this object contains all the attributes from the original element, **except for transforms, those are applied to the geometry**.

an output: "data" might look like:

```javascript
[
  [197.5, 185, 160, 250, {
    "class": "thick top",
    "stroke-dashArray": "7 2"
  }],
  [187.5, 92.5, 262.5, 92.5, {
    "class": "pen",
    "fill": "url(#gradient)"
  }],
  ...
]
```

## notes

### transforms

special attention is given to the transform attribute. consider the example:

```xml
<g transform="translate(50 30)">
  <line x1="0" y1="0" x2="10" y2="10"/>
</g>
```

SVG transforms are applied in a nested manner. this library recurses through the tree and builds a matrix stack, making sure the example above outputs one line as:

```xml
<line x1="50" y1="30" x2="60" y2="40"/>
```

## todo

- transforms inside a `<style>` aren't parsed.

## notes

the [getPointAtLength](https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement/getPointAtLength) method is implemented in all browsers but doesn't exist in node, hence, the svg-path-properties library. If you don't need to convert `<path>` items, this can be removed, shrinking the library size substantially.

## license

MIT
