// svg segmentize (c) Robby Kraft

// todo: introduce options {} as a second parameter, make available:
// RES_CIRCLE, RES_PATH

import segmentize from "./segmentize";

import vkXML from "../include/vkbeautify-xml";

import {
  DOMParser,
  XMLSerializer,
  document,
} from "./window";

const parseable = Object.keys(segmentize);
const svgNS = "http://www.w3.org/2000/svg";

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

const inputIntoXML = function (input) {
  // todo, how do you test for DOM level 2 core Element type in nodejs?
  return (typeof input === "string" || input instanceof String
    ? (new DOMParser()).parseFromString(input, "text/xml").documentElement
    : input);
};

const flatten_tree = function (element) {
  // the container objects in SVG: group, the svg itself
  if (element.tagName === "g" || element.tagName === "svg") {
    if (element.childNodes == null) { return []; }
    return Array.from(element.childNodes)
      .map(child => flatten_tree(child))
      .reduce((a, b) => a.concat(b), []);
  }
  return [element];
};

const attribute_list = function (element) {
  return Array.from(element.attributes)
    .filter(a => shape_attr[element.tagName].indexOf(a.name) === -1);
};

const svg = function (input) {
  const inputSVG = inputIntoXML(input);
  const newSVG = document.createElementNS(svgNS, "svg");
  // copy over attributes
  svgAttributes.map(a => ({ attribute: a, value: inputSVG.getAttribute(a) }))
    .filter(obj => obj.value != null && obj.value !== "")
    .forEach(obj => newSVG.setAttribute(obj.attribute, obj.value));
  // xmlns is required. make sure it's present
  if (newSVG.getAttribute("xmlns") === null) {
    newSVG.setAttribute("xmlns", svgNS);
  }
  const elements = flatten_tree(inputSVG);
  // copy over <style> elements
  const styles = elements
    .filter(e => e.tagName === "style" || e.tagName === "defs");
  if (styles.length > 0) {
    styles.map(style => style.cloneNode(true))
      .forEach(style => newSVG.appendChild(style));
  }
  // convert geometry to segments, preserving class
  const segments = elements
    .filter(e => parseable.indexOf(e.tagName) !== -1)
    .map(e => segmentize[e.tagName](e)
      .map(unit => [...unit, attribute_list(e)]))
    .reduce((a, b) => a.concat(b), []);
  // write segments into the svg
  segments.forEach((s) => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttributeNS(null, "x1", s[0]);
    line.setAttributeNS(null, "y1", s[1]);
    line.setAttributeNS(null, "x2", s[2]);
    line.setAttributeNS(null, "y2", s[3]);
    if (s[4] != null) {
      s[4].forEach(attr => line.setAttribute(attr.nodeName, attr.nodeValue));
    }
    newSVG.appendChild(line);
  });

  const stringified = new XMLSerializer().serializeToString(newSVG);
  const beautified = vkXML(stringified);
  return beautified;
};

const withAttributes = function (input) {
  const inputSVG = inputIntoXML(input);
  // convert geometry to segments, preserving class
  return flatten_tree(inputSVG)
    .filter(e => parseable.indexOf(e.tagName) !== -1)
    .map(e => segmentize[e.tagName](e).map((s) => {
      const obj = {};
      [obj.x1, obj.y1, obj.x2, obj.y2] = s;
      attribute_list(e).forEach((a) => {
        obj[a.nodeName] = a.value;
      });
      return obj;
    }))
    .reduce((a, b) => a.concat(b), []);
};

const segments = function (input) {
  const inputSVG = inputIntoXML(input);
  return flatten_tree(inputSVG)
    .filter(e => parseable.indexOf(e.tagName) !== -1)
    .map(e => segmentize[e.tagName](e))
    .reduce((a, b) => a.concat(b), []);
};

export {
  svg,
  withAttributes,
  segments,
};
