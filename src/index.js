/*
 * svg segmentize (c) Robby Kraft
 */

// todo: introduce options {} as a second parameter, make available:
// RES_CIRCLE, RES_PATH

import vkXML from "../include/vkbeautify-xml";

import window from "./environment/window";
import primitives from "./parsers/primitives";
import segmentize from "./segmentize";
import segmentsToSVG from "./toSVG";

const parseable = Object.keys(primitives);

const defaults = {
  input: "string", // "string", "svg"
  output: "string", // "string", "svg", "data"
  resolution: {
    circle: 64,
    ellipse: 64,
    path: 128
  }
};

const xmlStringToDOM = function (input) {
  return (typeof input === "string" || input instanceof String
    ? (new window.DOMParser()).parseFromString(input, "text/xml").documentElement
    : input);
};

const Segmentize = function (input, options = defaults) {
  // convert input to SVG DOM node (if needed)
  const inputSVG = options.input === "svg"
    ? input
    : xmlStringToDOM(input);

  const lineSegments = segmentize(inputSVG, options);

  // returns
  if (options.output === "data") {
    return lineSegments;
  }

  const newSVG = segmentsToSVG(lineSegments, inputSVG);
  if (options.output === "svg") {
    return newSVG;
  }
  // stringify
  const stringified = new window.XMLSerializer().serializeToString(newSVG);
  return vkXML(stringified);
}

/**
 * this is the fastest output, ignores transforms. a part of the first draft
 * but nice to keep around
 */
// Segmentize.segments = function (input) {
//   const inputSVG = xml_string_to_dom(input);
//   return flatten_tree(inputSVG)
//     .filter(e => parseable.indexOf(e.tagName) !== -1)
//     .map(e => primitives[e.tagName](e))
//     .reduce((a, b) => a.concat(b), []);
// };

export default Segmentize;
