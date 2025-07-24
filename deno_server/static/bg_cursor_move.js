// bg_cursor_move.ts
var scene = document.getElementById("spaceScene");
var title = document.querySelector("h1");
var root = document.documentElement;
function convertToRelative(x, y, width, height) {
  const relativeX = (x - width / 2) / width;
  const relativeY = (y - height / 2) / height;
  return [
    relativeX,
    relativeY
  ];
}
function convertTorem(px, base = 16) {
  return px / base;
}
if (scene !== null && title !== null) {
  scene.classList.add("resting");
  title.classList.add("resting");
  setTimeout(() => {
    scene.classList.remove("resting");
    title.classList.remove("resting");
  }, 1e3);
  document.addEventListener("mousemove", (e) => {
    const window_width = document.documentElement.clientWidth;
    const window_height = document.documentElement.clientHeight;
    if (convertTorem(window_width) < 48) return;
    const [relativeX, relativeY] = convertToRelative(e.pageX, e.pageY, window_width, window_height);
    const angleRad = Math.atan2(relativeY, relativeX);
    let angleDeg = Math.trunc(angleRad * (180 / Math.PI) + 90);
    if (angleDeg < 0) angleDeg += 360;
    const debugEl = document.getElementById("debug");
    if (debugEl !== null) {
      debugEl.innerText = `x=${relativeX.toFixed(3)},y=${relativeY.toFixed(3)},angle=${angleDeg}`;
    }
    const offsetSeverity = 0.01;
    const ratioAdjustment = 3 * window_width / window_height;
    const xOffset = relativeX * ratioAdjustment * window_width * offsetSeverity;
    const yOffset = relativeY * window_height * offsetSeverity;
    root.style.setProperty("--xPos", `${50 + xOffset}%`);
    root.style.setProperty("--yPos", `${50 + yOffset}%`);
    root.style.setProperty("--gradientAngle", `${angleDeg}deg`);
  });
  document.addEventListener("mouseleave", () => {
    root.style.setProperty("--xPos", "50%");
    root.style.setProperty("--yPos", "50%");
    root.style.setProperty("--gradientAngle", "90deg");
    scene.classList.add("resting");
    title.classList.add("resting");
  });
  document.addEventListener("mouseenter", () => {
    setTimeout(() => {
      scene.classList.remove("resting");
      title.classList.remove("resting");
    }, 1e3);
  });
}
