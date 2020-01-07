const flattenTree = function (element) {
  // the container objects in SVG: group, the svg itself
  if (element.tagName === "g" || element.tagName === "svg") {
    if (element.childNodes == null) { return []; }
    return Array.from(element.childNodes)
      .map(child => flattenTree(child))
      .reduce((a, b) => a.concat(b), []);
  }
  return [element];
};

export default flattenTree;
