const Segmentize = require("../svg-segmentize");

const allPrimitives = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="75 75 350 350" width="45vmax" height="45vmax">
    <style type="text/css">
      .pen { stroke: black; }
      .alpha-fill { fill: rgba(0,0,0,0.2); }
      .no-fill { fill: none; }
    </style>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#f8eed9;"/>
        <stop offset="100%" style="stop-color:#e35536;"/>
      </linearGradient>
    </defs>
    <g>
      <line class="pen" stroke-lineCap="round" stroke-width="3" x1="197.5" y1="185" x2="160" y2="250"/>
      <line class="pen" stroke-lineCap="round" stroke-width="3" x1="340" y1="250" x2="302.5" y2="185"/>
      <rect class="pen alpha-fill" x="187.5" y="92.5" width="75" height="75"/>
      <rect class="pen alpha-fill" x="237.5" y="87.5" width="75" height="75"/>
      <rect class="pen alpha-fill" x="212.5" y="82.5" width="75" height="75"/>
      <circle class="pen" fill="url(#gradient)" cx="350" cy="310" r="40"/>
      <ellipse  transform="rotate(-30 360 200)" class="pen no-fill" stroke-dashArray="7 2 1 2 " cx="360" cy="200" rx="12.5" ry="37.5"/>
      <!-- hexagon -->
      <polygon fill="none" stroke-dashArray="3 3" stroke="black" points="287.5,185 212.5,185 175,250 212.5,315 287.5,315 325,250 "/>
      <!-- hexagon interior -->
      <polyline stroke="#e35536" stroke-width="2" fill="none" points="278.1,201.3 306.2,250 278.1,298.7 221.9,298.7 193.8,250 221.9,201.3 "/>
      <!-- spiral (open path) -->
      <path class="pen no-fill" d="M108.6,217.5c-15.4,30.4-14.1,68.6,3.3,97.8c4.5,7.6,10.7,15,19.3,17c9.1,2.1,18.2-2.5,26.4-7c8.7-4.8,18.3-10.6,20.6-20.3c1.5-6.3-0.6-13-3.5-18.8c-5.5-10.8-15.1-20.6-27.2-21.7c-7.3-0.7-14.6,1.8-21.2,5c-4.7,2.3-9.4,5.1-12,9.7c-3.9,7-1.5,15.9,2.5,22.8c2.8,4.9,6.4,9.4,11.4,12.1c4.9,2.7,11.2,3.3,16.1,0.5c2-1.2,3.8-2.9,4.6-5.1c0.9-2.3,0.7-4.8,0-7.1c-1.1-3.9-3.9-7.5-7.7-8.9s-8.6-0.2-10.8,3.2c-2.2,3.4-0.8,8.8,3,10.3"/>
      <!-- round rect (closed path) -->
      <path style="stroke: black; fill: none;" d="M275.5,322.5h-51c-6.6,0-12,5.4-12,12v51c0,6.6,5.4,12,12,12h51c6.6,0,12-5.4,12-12v-51C287.5,327.9,282.1,322.5,275.5,322.5z"/>
    </g>
  </svg>`;


// const a_svg = Segmentize.svg(allPrimitives);
Segmentize.svg(allPrimitives);
const a_segments = Segmentize.segments(allPrimitives);
const a_withAttrs = Segmentize.withAttributes(allPrimitives);

console.log(a_segments.length === a_withAttrs.length
  ? "test passes" : "test fail. array lengths should match", a_segments.length, a_withAttrs.length);

const small = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- comment -->
  <rect fill="none" x="10" y="10" width="80" height="80"/>
  <line stroke="black" x1="0" y1="0" x2="100" y2="100"/>
</svg>`;

const b_svg = Segmentize.svg(small);
const b_segments = Segmentize.segments(small);
const b_withAttrs = Segmentize.withAttributes(small);

console.log("-------\n#1 svg\n", b_svg);
console.log("-------\n#2 segments\n", b_segments);
console.log("-------\n#3 withAttributes\n", b_withAttrs);

console.log(b_segments.length === b_withAttrs.length && b_segments.length === 5
  ? "test passes" : "test fail. array lengths should match", b_segments.length, b_withAttrs.length);

// const ellipse = (new DOMParser()).parseFromString(`<ellipse  transform="rotate(-30 360 200)" class="pen no-fill" stroke-dashArray="7 2 1 2 " cx="360" cy="200" rx="12.5" ry="37.5"/>`, "text/xml").documentElement;

// const eTransform = Array.from(ellipse.attributes).filter(e => e.nodeName === "transform").shift();
// console.log(ellipse);
// console.log(eTransform.baseVal);

const m = Segmentize.transformIntoMatrix("translate(1,2),scale(0.5,-5),a(1,1,2,3),b(1)");
const m2 = Segmentize.transformIntoMatrix("translate(1 2) scale(0.5 -5) a(1 1 2 3) b(1)");

console.log(m);
console.log(m2);

const m3 = Segmentize.transformIntoMatrix("rotate(180) matrix(1,0,0,-1,0,0) translate(10, 0) skewX(10) skewY(2) scale(2, 2)");

console.log(m3);

const nested = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <style>rect { stroke: black; fill: none;}</style>
  <rect width="100" height="100"/>
  <g transform="rotate(5 50 50)">
    <rect width="100" height="100"/>
    <g transform="translate(50 50) scale(0.707) translate(-50 -50)">
      <rect width="100" height="100"/>
      <g transform="translate(50 50) scale(0.707) translate(-50 -50)">
        <rect width="100" height="100"/>
        <g transform="rotate(45 50 50)">
          <rect width="100" height="100"/>
        </g>
      </g>
    </g>
  </g>
</svg>
`;
