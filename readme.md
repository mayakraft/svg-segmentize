# SVG segmentize

[![Build Status](https://travis-ci.org/robbykraft/svg-segmentize.svg?branch=master)](https://travis-ci.org/robbykraft/svg-segmentize)

This converts an SVG image into a copy containing only (straight) line segments. This works with every shape in the SVG 1.1 specification: *line*, *rect*, *circle*, *ellipse*, *polygon*, *polyline*, *path*. All attributes from the original geometry are carried over and applied to the corresponding line(s). you'll notice that:

- fills disappear (there are no closed shapes anymore)
- dashed lines are no longer visible on curves (curves are now collections of very short lines)

*see an [example here](https://robbykraft.github.io/svg-segmentize/test/) segmented image is on the right*

## usage

```javascript
const segments = Segmentize(input, options);
```

- **input** is an SVG, either a *string* or an *SVGElement*.
- **options** is a *Javascript object*, and is optional.

  - **options.input**: "string" / "svg"
  - **options.output**: "string" / "svg" / "data"
  - **options.resolution**: how many line segments do curve-types become?

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

**output: "data"**: this exports an array of line segments. endpoints are in this order: `[x1, y1, x2, y2]`

```javascript
[
  [0, 0, 10, 10, {}],
  [50, 40, 100, 150, {}],
  ...
]
```

the fifth entry for every line segment is a Javascript object that contains all the attributes from the original element, **except for transforms, those are applied to the geometry**.

an example output for "data" option:

```javascript
[
  [197.5, 185, 160, 250, {
    "class": "marker top",
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

### to do

- transforms inside a `<style>` aren't parsed.

## credit

- [SVG path properties](https://github.com/rveciana/svg-path-properties)
- [vkBeautify](https://github.com/vkiryukhin/vkBeautify)
- [XML DOM](https://github.com/xmldom/xmldom)

## license

MIT
