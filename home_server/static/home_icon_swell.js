// common.ts
function convertTorem(px, base = 16) {
  return px / base;
}
function isVPSmallerThanmd() {
  return convertTorem(document.documentElement.clientWidth) < 48;
}

// home_icon_swell.ts
var icons = document.querySelectorAll("div.icon");
document.addEventListener("mousemove", (e) => {
  for (const icon of icons) {
    const bounds = icon.getBoundingClientRect();
    const midX = bounds.right - (bounds.right - bounds.left) / 2;
    const midY = bounds.bottom - (bounds.bottom - bounds.top) / 2;
    let maxScale;
    let scaleFactor;
    if (isVPSmallerThanmd()) {
      maxScale = 1.3;
      scaleFactor = 100;
    } else {
      maxScale = 1.5;
      scaleFactor = 200;
    }
    ;
    const xtoCursor = Math.abs(midX - e.pageX);
    const ytoCursor = Math.abs(midY - e.pageY);
    const distance = Math.sqrt(xtoCursor ** 2 + ytoCursor ** 2);
    icon.style.scale = Math.max(maxScale - distance / scaleFactor, 1).toFixed(3);
  }
});
