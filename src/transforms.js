/**
 * SVG transforms are in DEGREES
 *
 *
 */

import { parseTransform } from "./parsers";

// const multiply_vector2_matrix2 = function (vector, matrix) {
//   return [
//     vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
//     vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5],
//   ];
// };
/**
 * line is an array of 4 numbers: [x1, y1, x2, y2]
 *
 */
const multiply_line_matrix2 = function (line, matrix) {
  return [
    line[0] * matrix[0] + line[1] * matrix[2] + matrix[4],
    line[0] * matrix[1] + line[1] * matrix[3] + matrix[5],
    line[2] * matrix[0] + line[3] * matrix[2] + matrix[4],
    line[2] * matrix[1] + line[3] * matrix[3] + matrix[5],
  ];
};

const multiply_matrices2 = function (m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
};

const matrixFormTranslate = function (params) {
  switch (params.length) {
    case 1: return [1, 0, 0, 1, params[0], 0];
    case 2: return [1, 0, 0, 1, params[0], params[1]];
    default: console.warn(`improper translate, ${params}`);
  }
  return undefined;
};

const matrixFormRotate = function (params) {
  const cos_p = Math.cos(params[0] / 180 * Math.PI);
  const sin_p = Math.sin(params[0] / 180 * Math.PI);
  switch (params.length) {
    case 1: return [cos_p, sin_p, -sin_p, cos_p, 0, 0];
    case 3: return [cos_p, sin_p, -sin_p, cos_p,
      -params[1] * cos_p + params[2] * sin_p + params[1],
      -params[1] * sin_p - params[2] * cos_p + params[2]];
    default: console.warn(`improper rotate, ${params}`);
  }
  return undefined;
};

const matrixFormScale = function (params) {
  switch (params.length) {
    case 1: return [params[0], 0, 0, params[0], 0, 0];
    case 2: return [params[0], 0, 0, params[1], 0, 0];
    default: console.warn(`improper scale, ${params}`);
  }
  return undefined;
};

const matrixFormSkewX = function (params) {
  return [1, 0, Math.tan(params[0] / 180 * Math.PI), 1, 0, 0];
};

const matrixFormSkewY = function (params) {
  return [1, Math.tan(params[0] / 180 * Math.PI), 0, 1, 0, 0];
};

const matrixForm = function (transformType, params) {
  switch (transformType) {
    case "translate": return matrixFormTranslate(params);
    case "rotate": return matrixFormRotate(params);
    case "scale": return matrixFormScale(params);
    case "skewX": return matrixFormSkewX(params);
    case "skewY": return matrixFormSkewY(params);
    case "matrix": return params;
    default: console.warn(`unknown transform type ${transformType}`);
  }
  return undefined;
};

const transformIntoMatrix = function (string) {
  return parseTransform(string)
    .map(el => matrixForm(el.transform, el.parameters))
    .filter(a => a !== undefined)
    .reduce((a, b) => multiply_matrices2(a, b), [1, 0, 0, 1, 0, 0]);
};

const getElementsTransform = function (element) {
  if (typeof element.getAttribute !== "function") {
    return [1, 0, 0, 1, 0, 0];
  }
  const transformAttr = element.getAttribute("transform");
  if (transformAttr != null && transformAttr !== "") {
    return transformIntoMatrix(transformAttr);
  }
  return [1, 0, 0, 1, 0, 0];
};

const apply_nested_transforms = function (element, stack = [1, 0, 0, 1, 0, 0]) {
  const local = multiply_matrices2(stack, getElementsTransform(element));
  element.matrix = local;
  // the container objects in SVG: group, the svg itself
  if (element.tagName === "g" || element.tagName === "svg") {
    if (element.childNodes == null) { return; }
    Array.from(element.childNodes)
      .forEach(child => apply_nested_transforms(child, local));
  }
};

export {
  multiply_line_matrix2,
  matrixForm,
  transformIntoMatrix,
  apply_nested_transforms,
};
