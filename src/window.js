// get DOMParser and XMLSerializer from the browser or from Node

import {
  isBrowser,
  isNode,
} from "./detect";

const htmlString = "<!DOCTYPE html><title>a</title>";
const out = {};

if (isNode()) {
  const { DOMParser, XMLSerializer } = require("xmldom");
  out.DOMParser = DOMParser;
  out.XMLSerializer = XMLSerializer;
  out.document = new DOMParser().parseFromString(htmlString, "text/html");
} else if (isBrowser()) {
  out.DOMParser = window.DOMParser;
  out.XMLSerializer = window.XMLSerializer;
  out.document = window.document;
}

const { DOMParser, XMLSerializer, document } = out;

export {
  DOMParser,
  XMLSerializer,
  document,
};
