// svg segmentize (c) Robby Kraft

// todo: introduce options {} as a second parameter, make available:
// RES_CIRCLE, RES_PATH

import primitives from "./parsers/primitives";
import vkXML from "../include/vkbeautify-xml";
import window from "./environment/window";
import segmentize from "./segmentize";

const parseable = Object.keys(primitives);

const DEFAULTS = {
  string: true,
  svg: false,
};

/**
 * this is the fastest output, ignores transforms. a part of the first draft
 * but nice to keep around
 */
const segments = function (input) {
  const inputSVG = xml_string_to_dom(input);
  return flatten_tree(inputSVG)
    .filter(e => parseable.indexOf(e.tagName) !== -1)
    .map(e => primitives[e.tagName](e))
    .reduce((a, b) => a.concat(b), []);
};

export default segmentize;
