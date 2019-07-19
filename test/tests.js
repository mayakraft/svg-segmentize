const { DOMParser, XMLSerializer } = require("xmldom");
const Segmentize = require("../svg-segmentize");

const nested_transforms = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <style>line, rect { stroke: black; fill: none;}</style>
  <rect width="10" height="10"/>
  <g transform="translate(50 50)">
    <rect width="10" height="10"/>
    <g transform="rotate(45)">
      <rect width="10" height="10"/>
      <g transform="translate(10 10)">
        <rect width="10" height="10"/>
        <g transform="translate(10 10)">
          <rect width="10" height="10"/>
        </g>
      </g>
      <g transform="scale(0.707)">
        <rect width="10" height="10"/>
      </g>
    </g>
  </g>
</svg>`;

const nested = Segmentize(nested_transforms, { svg: true });

const str = (new XMLSerializer()).serializeToString(nested);

// console.log("nested", nested);
console.log("str", str);
