import {
	default as PathProperties
} from "../include/svg-path-properties/path-properties";

/*
 * convert an SVG into line segments. include all SVG primitives
 * all line segments are encoded as 1 array of 4 numbers:
 *  [ x1, y1, x2, y2 ]
 */

const RES_CIRCLE = 64;
const RES_PATH = 128;

// SVG will occasionally remove x1="0", attribute absense is an implied 0.
let empty = { baseVal: { value: 0 } };

const getAttributes = function(element, attributeList) {
	let indices = attributeList.map(attr => {
		for (var i = 0; i < element.attributes.length; i++) {
			if (element.attributes[i].nodeName === attr) {
				return i;
			}
		}
	});
	return indices
		.map(i => i === undefined ? empty : element.attributes[i])
		.map(attr => attr.value !== undefined ? attr.value : attr.baseVal.value);
}

const svg_line_to_segments = function(line) {
	return [getAttributes(line, ["x1","y1","x2","y2"])];
}
const svg_rect_to_segments = function(rect) {
	let attrs = getAttributes(rect, ["x","y","width","height"]);
	let x = parseFloat(attrs[0]);
	let y = parseFloat(attrs[1]);
	let width = parseFloat(attrs[2]);
	let height = parseFloat(attrs[3]);
	return [
		[x, y, x+width, y],
		[x+width, y, x+width, y+height],
		[x+width, y+height, x, y+height],
		[x, y+height, x, y]
	];
}
const svg_circle_to_segments = function(circle) {
	let attrs = getAttributes(circle, ["cx", "cy", "r"]);
	let cx = parseFloat(attrs[0]);
	let cy = parseFloat(attrs[1]);
	let r = parseFloat(attrs[2]);
	return Array.from(Array(RES_CIRCLE))
		.map((_,i) => [
			cx + r*Math.cos(i/RES_CIRCLE*Math.PI*2),
			cy + r*Math.sin(i/RES_CIRCLE*Math.PI*2)
		]).map((_,i,arr) => [
			arr[i][0],
			arr[i][1],
			arr[(i+1)%arr.length][0],
			arr[(i+1)%arr.length][1]
		]);
}
const svg_ellipse_to_segments = function(ellipse) {
	let attrs = getAttributes(ellipse, ["cx", "cy", "rx", "ry"]);
	let cx = parseFloat(attrs[0]);
	let cy = parseFloat(attrs[1]);
	let rx = parseFloat(attrs[2]);
	let ry = parseFloat(attrs[3]);
	return Array.from(Array(RES_CIRCLE))
		.map((_,i) => [
			cx + rx*Math.cos(i/RES_CIRCLE*Math.PI*2),
			cy + ry*Math.sin(i/RES_CIRCLE*Math.PI*2)
		]).map((_,i,arr) => [
			arr[i][0],
			arr[i][1],
			arr[(i+1)%arr.length][0],
			arr[(i+1)%arr.length][1]
		]);
}

const pointStringToArray = function(str) {
	return str.split(" ")
		.filter(s => s !== "")
		.map(p => p.split(",")
			.map(n => parseFloat(n))
		);
}
const svg_polygon_to_segments = function(polygon) {
	let points = "";
	for (var i = 0; i < polygon.attributes.length; i++) {
		if (polygon.attributes[i].nodeName === "points") {
			points = polygon.attributes[i].value;
			break;
		}
	}
	return pointStringToArray(points)
		.map((_,i,a) => [
			a[i][0],
			a[i][1],
			a[(i+1)%a.length][0],
			a[(i+1)%a.length][1]
		])
}
const svg_polyline_to_segments = function(polyline) {
	let circularPath = svg_polygon_to_segments(polyline);
	circularPath.pop();
	return circularPath;
}
const svg_path_to_segments = function(path) {
	let d = path.getAttribute("d");
	let prop = PathProperties(d); // path properties
	let length = prop.getTotalLength();
	let isClosed = (d[d.length-1] === "Z" || d[d.length-1] === "z");
	let segmentLength = (isClosed
		? length / RES_PATH
		: length / (RES_PATH-1));
	let pathsPoints = Array.from(Array(RES_PATH))
		.map((_,i) => prop.getPointAtLength(i*segmentLength))
		.map(p => [p.x, p.y]);
	let segments = pathsPoints.map((_,i,a) => [
		a[i][0],
		a[i][1],
		a[(i+1)%a.length][0],
		a[(i+1)%a.length][1]
	]);
	if (!isClosed) { segments.pop(); }
	return segments;
}

const parsers = {
	"line": svg_line_to_segments,
	"rect": svg_rect_to_segments,
	"circle": svg_circle_to_segments,
	"ellipse": svg_ellipse_to_segments,
	"polygon": svg_polygon_to_segments,
	"polyline": svg_polyline_to_segments,
	"path": svg_path_to_segments
};

export default parsers;
