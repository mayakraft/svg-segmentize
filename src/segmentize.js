/*
 * svg segmentize (c) Robby Kraft
 */

import primitives from "./parsers/primitives";
import geomAttributes from "./parsers/attributes";
import flatten from "./dom/flatten";
import storeNestedTransformOnElements from "./dom/nested_transforms";
import { multiply_line_matrix2 } from "./math/matrix";

const parseable = Object.keys(primitives);

const attribute_list = function (element) {
  return Array.from(element.attributes)
    .filter(a => geomAttributes[element.tagName].indexOf(a.name) === -1);
};

const objectifyAttributeList = function (list) {
  const obj = {};
  list.forEach((a) => { obj[a.nodeName] = a.value; });
  return obj;
};

const segmentize = function (input, options = {}) {
  const RESOLUTION = typeof options.resolution === "object"
    ? options.resolution
    : {};
  if (typeof options.resolution === "number") {
    ["circle", "ellipse", "path"].forEach((k) => {
      RESOLUTION[k] = options.resolution;
    });
  }

  // flatten all layers, carry (nested) transforms over as .matrix property on every node
  storeNestedTransformOnElements(input);
  const elements = flatten(input);

  // convert geometry to segments, carry long all attributes as the 4 element in the array
  const lineSegments = elements
    .filter(el => parseable.indexOf(el.tagName) !== -1)
    .map(el => primitives[el.tagName](el, RESOLUTION[el.tagName])
      .map(unit => multiply_line_matrix2(unit, el.matrix))
      .map(unit => [...unit, attribute_list(el)]))
    .reduce((a, b) => a.concat(b), []);

  // convert the attribute entries into an object
  // VERY IMPORTANT- filter out any transforms since these have been applied to the geometry
  lineSegments
    .filter(a => a[4] !== undefined)
    .forEach((seg) => {
      const noTransforms = seg[4].filter(a => a.nodeName !== "transform");
      seg[4] = objectifyAttributeList(noTransforms);
    });

  return lineSegments;
};

export default segmentize;
