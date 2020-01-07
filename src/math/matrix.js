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

export const multiply_line_matrix2 = function (line, matrix) {
  return [
    line[0] * matrix[0] + line[1] * matrix[2] + matrix[4],
    line[0] * matrix[1] + line[1] * matrix[3] + matrix[5],
    line[2] * matrix[0] + line[3] * matrix[2] + matrix[4],
    line[2] * matrix[1] + line[3] * matrix[3] + matrix[5],
  ];
};

export const multiply_matrices2 = function (m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
};
