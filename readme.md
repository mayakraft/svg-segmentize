# SVG segmentize

[![Build Status](https://travis-ci.org/robbykraft/svg-segmentize.svg?branch=master)](https://travis-ci.org/robbykraft/svg-segmentize)

this processes an .svg into a copy containing only (straight) line segments. it can handle every shape in the SVG 1.1 specification:

- line
- rect
- circle
- ellipse
- polygon
- polyline
- path

all attributes (style, inline style, and presentation) are copied over as well. you'll discover that

- transforms continue to work
- fills disappear (there are no closed shapes anymore)
- dashed lines are only visible on long line segments (not curves)

see an [example here](https://robbykraft.github.io/svg-segmentize/test/) *segmented image is on the right*

## input

the input can be one of two types:

- string containing SVG in valid XML encoding
- DOM level-2 Element node

## output

the output can be one of two types:

- image: SVG image as a XML-encoded string
- data: the line segment points in array form

### usage 1: SVG output

```javascript
Segmentize.svg(svgElement);
```

**output**: a new svg representation containing only `<line>` geometry

the new svg contains copies of any `<style>` definitions and applies any `class` from the old geometry to its new corresponding line(s).

> see example `test/index.html`

### usage 2: data output

This is available two ways:

1. the line endpoints, nothing more. `[x1, y1, x2, y2]`
2. the line endpoints, with all the accompanying attributes, `style`, `fill`, `stroke`, anything else contained on the element.

```javascript
Segmentize.segments(svgElement);
```

```javascript
Segmentize.withAttributes(svgElement);
```

**output segments**: an array of arrays of numbers, where each segment is encoded. `[x1, y1, x2, y2]`

```javascript
[
  [197.5, 185, 160, 250],
  [340, 250, 302.5, 185],
  [187.5, 92.5, 262.5, 92.5],
  ...
]
```

**output withAttributes**: an array of objects, each attribute including x1, y1, x2, y2 are keys with their associated values.

```javascript
[
  { x1: 355.5,
    y1: 234,
    x2: 354.1,
    y2: 233,
    transform: 'rotate(-30 360 200)',
    class: 'pen no-fill',
    'stroke-dashArray': '7 2 1 2 '
  },
  { x1: 389,
    y1: 306,
    x2: 390,
    y2: 310,
    class: 'pen',
    fill: 'url(#gradient)'
  },
  ...
]
```

# todo

options parameter, which includes the resolution of curves.

# license

MIT