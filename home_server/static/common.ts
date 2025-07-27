function convertTorem(px: number, base: number = 16) {
  return px / base;
}

export function isVPSmallerThanmd() { // smaller than md breakpoint (48 rem)
  return convertTorem(document.documentElement.clientWidth) < 48;
}
