# SVG segmentize

[![Build Status](https://travis-ci.org/robbykraft/svg-segmentize.svg?branch=master)](https://travis-ci.org/robbykraft/svg-segmentize)

this converts an SVG image into a copy containing only (straight) line segments, ensuring **no overlapping lines/paths/shapes**, a necessary condition of [planar graphs](https://en.wikipedia.org/wiki/Planar_graph).

*see an [example here](https://robbykraft.github.io/svg-segmentize/test/) segmented image is on the right*

this can handle every shape in the SVG 1.1 specification:

- line
- rect
- circle
- ellipse
- polygon
- polyline
- path

all attributes from the original geometry are carried over and applied to the corresponding line(s). you'll notice that:

- fills disappear (there are no closed shapes anymore)
- dashed lines are no longer visible on curves (curves become many short lines)

## usage

web

```javascript
let lineSegments = Segmentize(inputSVG);
```

node

```javascript
const Segmentize = require("svg-segmentize");

let lineSegments = Segmentize(inputSVG);
```

arguments (2):

- **inputSVG** must be an SVG, but it can be in one of two forms:
- options is an optional Javascript object. Keys are as follows:

```javascript
let svg = Segmentize(inputSVG, { svg: true });
```

- svg: **boolean** *default false*
- string: **boolean** *default true*

**svg** setting true will make the output an SVG. this will render as a string unless..

**string** set false, and the SVG will be output as a DOM node. (only used if **svg** is true)

- stringified
- XML DOM node

## notes

### transforms

special attention is given to the transform attribute. consider the example:

```xml
<g transform="translate(50 30)">
  <line x1="0" y1="0" x2="10" y2="10"/>
</g>
```

SVG transforms are applied in a nested manner. this library recurses through the tree and builds a matrix stack, making sure the example above outputs one line as:

```javascript
[
  [50, 30, 60, 40]
]
```

### input

the input can be one of two types:

- SVG, stringified
- SVG, as a DOM level-2 Element node

### output

**by default** the output is an array of arrays: the line segment points in array form. the **options** argument below describes how to make the output an SVG.

```javascript
[
  [0, 0, 10, 10, {}],
  [50, 40, 100, 150, {}],
  ...
]
```

lines in array form are defined by their endpoints: `[x1, y1, x2, y2]`

### that last array element

for every segment an object sits at array spot [4], this object contains all the attributes from the original geometry element, minus any transforms.

the output in full would look something like:

```javascript
[
  [197.5, 185, 160, 250, {
    class: 'thick no-fill',
    'stroke-dashArray': '7 2 1 2 '
  }],
  [187.5, 92.5, 262.5, 92.5, {
    class: 'pen',
    fill: 'url(#gradient)'
  }],
  ...
]
```

## todo

- options parameter to include the resolution of curves

- transforms inside a `<style>` aren't parsed.

## notes

the [getPointAtLength](https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement/getPointAtLength) method is implemented in all browsers but doesn't exist in node, hence, the svg-path-properties library. If you don't need to convert `<path>` items, this can be removed, shrinking the library size substantially.

## license

MIT
