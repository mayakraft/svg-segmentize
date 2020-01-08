/*
 * svg segmentize (c) Robby Kraft
 */

/** this converts "stroke-width" into "strokeWidth" */
const camelize = function (str) {
  if (typeof str !== "string") { return ""; }
  return str.replace(/(?:^|[-])(\w)/g, (a, c) => (a.substr(0, 1) === "-"
    ? c.toUpperCase()
    : c));
};

const parseStyle = function (el) {
  const output = {};
  if (!el || !el.style || !el.style.cssText) {
    return output;
  }
  const style = el.style.cssText.split(";");
  for (let i = 0; i < style.length; i += 1) {
    const rule = style[i].trim();
    if (rule) {
      const ruleParts = rule.split(":");
      const key = camelize(ruleParts[0].trim());
      output[key] = ruleParts[1].trim();
    }
  }
  return output;
};

export default parseStyle;
