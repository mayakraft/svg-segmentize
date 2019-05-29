import minify from "rollup-plugin-babel-minify";
import cleanup from "rollup-plugin-cleanup";

module.exports = {
  input: "./src/index.js",
  output: {
    name: "Segmentize",
    file: "svg-segmentize.js",
    format: "umd",
    // format: 'es',
    banner: "/* (c) Robby Kraft, MIT License\n * makes use of these libraries:\n * - SVG Path Properties by Roger Veciana i Rovira\n * - vkBeautify by Vadim Kiryukhin\n */",
  },
  plugins: [
    cleanup({
      comments: "none",
      maxEmptyLines: 0,
    }),
    minify(),
  ],
};
