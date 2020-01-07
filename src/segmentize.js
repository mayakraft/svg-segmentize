// svg segmentize (c) Robby Kraft

// todo: introduce options {} as a second parameter, make available:
// RES_CIRCLE, RES_PATH

import vkXML from "../include/vkbeautify-xml";

import window from "./environment/window";
import svgNS from "./environment/namespace"
import primitives from "./parsers/primitives";
import xmlStringToDOM from "./parsers/xml";
import flatten from "./dom/flatten";
import nested_transforms from "./dom/nested_transforms";
import { multiply_line_matrix2 } from "./math/matrix";

const parseable = Object.keys(primitives);

const DEFAULTS = {
  string: true,
  svg: false,
};

// valid attributes for the <svg> object
const svgAttributes = [
  "version",
  "xmlns",
  "contentScriptType",
  "contentStyleType",
  "baseProfile",
  "class",
  "externalResourcesRequired",
  "x",
  "y",
  "width",
  "height",
  "viewBox",
  "preserveAspectRatio",
  "zoomAndPan",
  "style",
];

// attributes that specify the geometry of each shape type
const shape_attr = {
  line: ["x1", "y1", "x2", "y2"],
  rect: ["x", "y", "width", "height"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  path: ["d"],
};

const attribute_list = function (element) {
  return Array.from(element.attributes)
    .filter(a => shape_attr[element.tagName].indexOf(a.name) === -1);
};

const objectifyAttributeList = function (list) {
  const obj = {};
  list.forEach((a) => {
    obj[a.nodeName] = a.value;
  });
  return obj;
};

const Segmentize = function (input, options) {
  const inputSVG = xmlStringToDOM(input);
  nested_transforms(inputSVG);
  const elements = flatten(inputSVG);
  // convert geometry to segments, preserving class
  const lineSegments = elements
    .filter(e => parseable.indexOf(e.tagName) !== -1)
    .map(e => primitives[e.tagName](e)
      .map(unit => multiply_line_matrix2(unit, e.matrix))
      .map(unit => [...unit, attribute_list(e)]))
    .reduce((a, b) => a.concat(b), []);

  // carry over any style. VERY IMPORTANT. filter out any transforms since
  // these have been applied to the geometry
  lineSegments
    .filter(a => a[4] !== undefined)
    .forEach((seg) => {
      const noTransforms = seg[4].filter(a => a.nodeName !== "transform");
      seg[4] = objectifyAttributeList(noTransforms);
    });

  const o = Object.assign(Object.assign({}, DEFAULTS), options);

  if (o.svg) {
    const newSVG = window.document.createElementNS(svgNS, "svg");
    // copy over attributes
    svgAttributes.map(a => ({ attribute: a, value: inputSVG.getAttribute(a) }))
      .filter(obj => obj.value != null && obj.value !== "")
      .forEach(obj => newSVG.setAttribute(obj.attribute, obj.value));
    // xmlns is required. make sure it's present
    if (newSVG.getAttribute("xmlns") === null) {
      newSVG.setAttribute("xmlns", svgNS);
    }
    // copy over <style> elements
    const styles = elements
      .filter(e => e.tagName === "style" || e.tagName === "defs");
    if (styles.length > 0) {
      styles.map(style => style.cloneNode(true))
        .forEach(style => newSVG.appendChild(style));
    }
    // write lineSegments into the svg
    lineSegments.forEach((s) => {
      const line = window.document.createElementNS(svgNS, "line");
      line.setAttributeNS(null, "x1", s[0]);
      line.setAttributeNS(null, "y1", s[1]);
      line.setAttributeNS(null, "x2", s[2]);
      line.setAttributeNS(null, "y2", s[3]);
      if (s[4] != null) {
        Object.keys(s[4]).forEach(key => line.setAttribute(key, s[4][key]));
      }
      newSVG.appendChild(line);
    });
    if (o.string === false) { return newSVG; }
    const stringified = new window.XMLSerializer().serializeToString(newSVG);
    const beautified = vkXML(stringified);
    return beautified;
  }
  return lineSegments;
};

export default Segmentize;
