/*
 * convert an SVG into line segments. include all SVG primitives
 * all line segments are encoded as 1 array of 4 numbers:
 *  [ x1, y1, x2, y2 ]
 */

const RES_CIRCLE = 64;
const RES_PATH = 64;

const svg_line_to_segments = function(line) {
	return [[
		line.x1.baseVal.value,
		line.y1.baseVal.value,
		line.x2.baseVal.value,
		line.y2.baseVal.value
	]];
}
const svg_rect_to_segments = function(rect) {
	let x = rect.x.baseVal.value;
	let y = rect.y.baseVal.value;
	let width = rect.width.baseVal.value;
	let height = rect.height.baseVal.value;
	return [
		[x, y, x+width, y],
		[x+width, y, x+width, y+height],
		[x+width, y+height, x, y+height],
		[x, y+height, x, y]
	];
}
const svg_circle_to_segments = function(circle) {
	let x = circle.cx.baseVal.value;
	let y = circle.cy.baseVal.value;
	let r = circle.r.baseVal.value;
	return Array.from(Array(RES_CIRCLE))
		.map((_,i) => [x + r*Math.cos(i/RES_CIRCLE*Math.PI*2), y + r*Math.sin(i/RES_CIRCLE*Math.PI*2)])
		.map((_,i,arr) => [arr[i][0], arr[i][1], arr[(i+1)%arr.length][0], arr[(i+1)%arr.length][1]]);
}
const svg_ellipse_to_segments = function(ellipse) {
	let x = ellipse.cx.baseVal.value;
	let y = ellipse.cy.baseVal.value;
	let rx = ellipse.rx.baseVal.value;
	let ry = ellipse.ry.baseVal.value;
	return Array.from(Array(RES_CIRCLE))
		.map((_,i) => [x + rx*Math.cos(i/RES_CIRCLE*Math.PI*2), y + ry*Math.sin(i/RES_CIRCLE*Math.PI*2)])
		.map((_,i,arr) => [arr[i][0], arr[i][1], arr[(i+1)%arr.length][0], arr[(i+1)%arr.length][1]]);
}
const svg_polygon_to_segments = function(polygon) {
	return Array.from(polygon.points)
		.map(p => [p.x, p.y])
		.map((_,i,a) => [a[i][0], a[i][1], a[(i+1)%a.length][0], a[(i+1)%a.length][1]])
}
const svg_polyline_to_segments = function(polyline) {
	let circularPath = svg_polygon_to_segments(polyline);
	circularPath.pop();
	return circularPath;
}
const svg_path_to_segments = function(path) {
	let d = path.getAttribute("d");
	let isClosed = (d[d.length-1] === "Z" || d[d.length-1] === "z");
	let segmentLength = (isClosed
		? path.getTotalLength() / RES_PATH
		: path.getTotalLength() / (RES_PATH-1));
	let pathsPoints = Array.from(Array(RES_PATH))
		.map((_,i) => path.getPointAtLength(i*segmentLength))
		.map(p => [p.x, p.y]);
	let segments = pathsPoints.map((_,i,a) => [a[i][0], a[i][1], a[(i+1)%a.length][0], a[(i+1)%a.length][1]]);
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
