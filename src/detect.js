const isBrowser = function () {
  return typeof window !== "undefined";
};

const isNode = function () {
  return typeof window === "undefined" && typeof process !== "undefined";
};

const isWebWorker = function () {
  return typeof self !== "undefined" && typeof postMessage === "function";
};

export {
  isBrowser,
  isNode,
  isWebWorker,
};
