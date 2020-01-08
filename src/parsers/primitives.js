/*
 * svg segmentize (c) Robby Kraft
 */

import PathProperties from "../../include/svg-path-properties/path-properties";

// default curve resolution. number of straight line segments to be replaced by
const RES_CIRCLE = 64;
const RES_ELLIPSE = 64;
const RES_PATH = 128;

// SVG will occasionally remove x1="0", attribute absense is an implied 0.
const emptyValue = { value: 0 };

/**
 * in SVG a list of points is a SPACE-separated string, where each point is
 * COMMA-separated. example: 0.5,0.5 2,3 10,1
 */
const pointStringToArray = function (str) {
  return str.split(" ")
    .filter(s => s !== "")
    .map(p => p.split(",")
      .map(n => parseFloat(n)));
};

const getAttributes = function (element, attributeList) {
  const indices = attributeList.map((attr) => {
    for (let i = 0; i < element.attributes.length; i += 1) {
      if (element.attributes[i].nodeName === attr) {
        return i;
      }
    }
    return undefined;
  });
  return indices
    .map(i => (i === undefined ? emptyValue : element.attributes[i]))
    .map(attr => (attr.value !== undefined ? attr.value : attr.baseVal.value));
};

const svg_line_to_segments = function (line) {
  return [getAttributes(line, ["x1", "y1", "x2", "y2"])];
};
const svg_rect_to_segments = function (rect) {
  const attrs = getAttributes(rect, ["x", "y", "width", "height"]);
  const x = parseFloat(attrs[0]);
  const y = parseFloat(attrs[1]);
  const width = parseFloat(attrs[2]);
  const height = parseFloat(attrs[3]);
  return [
    [x, y, x + width, y],
    [x + width, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x, y],
  ];
};
const svg_circle_to_segments = function (circle, RESOLUTION = RES_CIRCLE) {
  const attrs = getAttributes(circle, ["cx", "cy", "r"]);
  const cx = parseFloat(attrs[0]);
  const cy = parseFloat(attrs[1]);
  const r = parseFloat(attrs[2]);
  return Array.from(Array(RESOLUTION))
    .map((_, i) => [
      cx + r * Math.cos(i / RESOLUTION * Math.PI * 2),
      cy + r * Math.sin(i / RESOLUTION * Math.PI * 2),
    ]).map((_, i, arr) => [
      arr[i][0],
      arr[i][1],
      arr[(i + 1) % arr.length][0],
      arr[(i + 1) % arr.length][1],
    ]);
};
const svg_ellipse_to_segments = function (ellipse, RESOLUTION = RES_ELLIPSE) {
  const attrs = getAttributes(ellipse, ["cx", "cy", "rx", "ry"]);
  const cx = parseFloat(attrs[0]);
  const cy = parseFloat(attrs[1]);
  const rx = parseFloat(attrs[2]);
  const ry = parseFloat(attrs[3]);
  return Array.from(Array(RESOLUTION))
    .map((_, i) => [
      cx + rx * Math.cos(i / RESOLUTION * Math.PI * 2),
      cy + ry * Math.sin(i / RESOLUTION * Math.PI * 2),
    ]).map((_, i, arr) => [
      arr[i][0],
      arr[i][1],
      arr[(i + 1) % arr.length][0],
      arr[(i + 1) % arr.length][1],
    ]);
};
const svg_polygon_to_segments = function (polygon) {
  let points = "";
  for (let i = 0; i < polygon.attributes.length; i += 1) {
    if (polygon.attributes[i].nodeName === "points") {
      points = polygon.attributes[i].value;
      break;
    }
  }
  return pointStringToArray(points)
    .map((_, i, a) => [
      a[i][0],
      a[i][1],
      a[(i + 1) % a.length][0],
      a[(i + 1) % a.length][1],
    ]);
};
const svg_polyline_to_segments = function (polyline) {
  const circularPath = svg_polygon_to_segments(polyline);
  circularPath.pop();
  return circularPath;
};
const svg_path_to_segments = function (path, RESOLUTION = RES_PATH) {
  const d = path.getAttribute("d");
  const prop = PathProperties(d); // path properties
  const length = prop.getTotalLength();
  const isClosed = (d[d.length - 1] === "Z" || d[d.length - 1] === "z");
  const segmentLength = (isClosed
    ? length / RESOLUTION
    : length / (RESOLUTION - 1));
  const pathsPoints = Array.from(Array(RESOLUTION))
    .map((_, i) => prop.getPointAtLength(i * segmentLength))
    .map(p => [p.x, p.y]);
  const segments = pathsPoints.map((_, i, a) => [
    a[i][0],
    a[i][1],
    a[(i + 1) % a.length][0],
    a[(i + 1) % a.length][1],
  ]);
  if (!isClosed) { segments.pop(); }
  return segments;
};

const parsers = {
  line: svg_line_to_segments,
  rect: svg_rect_to_segments,
  circle: svg_circle_to_segments,
  ellipse: svg_ellipse_to_segments,
  polygon: svg_polygon_to_segments,
  polyline: svg_polyline_to_segments,
  path: svg_path_to_segments,
};

export default parsers;
