import window from "../environment/window";

const xmlStringToDOM = function (input) {
  // todo, how do you test for DOM level 2 core Element type in nodejs?
  return (typeof input === "string" || input instanceof String
    ? (new window.DOMParser()).parseFromString(input, "text/xml").documentElement
    : input);
};

export default xmlStringToDOM;
