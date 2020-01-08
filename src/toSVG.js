/*
 * svg segmentize (c) Robby Kraft
 */

import window from "./environment/window";
import svgNS from "./environment/namespace"
import attributes from "./parsers/attributes";

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

// these will be copied over from the original SVG, but
// only if they exist as a 1st-level child inside the <svg>
const headerTagNames = {
  "defs": true,
  "metadata": true,
  "title": true,
  "desc": true,
  "style": true,
};

const segmentsToSVG = function (lineSegments, inputSVG) {
  const newSVG = window.document.createElementNS(svgNS, "svg");
  // copy over attributes
  if (inputSVG !== undefined) {
    svgAttributes.map(a => ({ attribute: a, value: inputSVG.getAttribute(a) }))
      .filter(obj => obj.value != null && obj.value !== "")
      .forEach(obj => newSVG.setAttribute(obj.attribute, obj.value));
  }
  // xmlns is required. make sure it's present
  if (newSVG.getAttribute("xmlns") === null) {
    newSVG.setAttribute("xmlns", svgNS);
  }
  // copy over <defs> and other header elements
  Array.from(inputSVG.childNodes)
    .filter(el => headerTagNames[el.tagName])
    .map(el => el.cloneNode(true))
    .forEach(el => newSVG.appendChild(el));
  // write lineSegments into the svg
  lineSegments.forEach((s) => {
    const line = window.document.createElementNS(svgNS, "line");
    attributes.line.forEach((attr, i) => line.setAttributeNS(null, attr, s[i]));
    if (s[4] != null) {
      Object.keys(s[4]).forEach(key => line.setAttribute(key, s[4][key]));
    }
    newSVG.appendChild(line);
  });
  return newSVG;
};

export default segmentsToSVG;
