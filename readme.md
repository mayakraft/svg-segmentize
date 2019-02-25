# svg segmentize

this processes an .svg into a copy containing only (straight) line segments. it can handle every shape in the SVG 1.1 specification:

- line
- rect
- circle
- ellipse
- polygon
- polyline
- path

the output can be in two forms:

- image: another .svg containing only lines
- data: the line segment points in array form

all attributes (style, inline style, and presentation) are copied over as well. you'll discover that

- transforms continue to work
- fills disappear (there are no closed shapes anymore)
- dashed lines are only visible on long line segments (not curves)

see an [example here](https://robbykraft.github.io/svg-segmentize/test/) *segmented image is on the right*

## usage 1: SVG output

```javascript
Segmentize.svg(svgElement);
```

**input**: an svg element

**output**: a new svg element containing only `<line>` geometry

the new svg contains copies of any `<style>` definitions and applies any `class` from the old geometry to its new corresponding line(s).

> see example `test/index.html`

## usage 2: data output

```javascript
Segmentize.segments(svgElement);
```

**input**: an svg element

**output**: an array of arrays of numbers, where each segment is encoded: [x1, y1, x2, y2]

```javascript
[
  [197.5, 185, 160, 250],
  [340, 250, 302.5, 185],
  [187.5, 92.5, 262.5, 92.5],
  ...
]
```

## license

mit