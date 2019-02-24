# svg segmentize

## usage 1

```javascript
Segmentize.svg(svgElement);
```

**input**: an svg element
**output**: a new svg element containing only `<line>` geometry

the new svg contains copies of any `<style>` definitions and applies any `class` from the old geometry to its new corresponding line(s).

> see example `test/index.html`

## usage 2

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

## todo

- [ ] transforms are ignored during import
- [ ] attributes from drawings are not copied over

## license

mit