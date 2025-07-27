// common.ts
function convertTorem(px, base = 16) {
  return px / base;
}
function isVPSmallerThanmd() {
  return convertTorem(document.documentElement.clientWidth) < 48;
}
export { isVPSmallerThanmd };
