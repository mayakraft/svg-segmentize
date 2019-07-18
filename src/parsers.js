/**
 * parse the value of a SVG transform attribute
 * @param {string} transform, like "translate(20 30) rotate(30) skewY(10)"
 * @returns {object[]} array of objects, {transform:__, parameters:__}
 */
export const parse_transform = function (transform) {
  const parsed = transform.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?\s*)+\))+/g);
  const listForm = parsed.map(a => a.match(/[\w\.\-]+/g));
  return listForm.map(a => ({
    transform: a.shift(),
    parameters: a.map(p => parseFloat(p)),
  }));
};

/**
 * this converts "stroke-width" into "strokeWidth"
 */
const camelize = function (str) {
  if (typeof str !== "string") { return ""; }
  return str.replace(/(?:^|[-])(\w)/g, (a, c) => (a.substr(0, 1) === "-"
    ? c.toUpperCase()
    : c));
};

export const parseStyle = function (el) {
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
