// const container = document.getElementById("container");
const scene = document.getElementById("scene");
const title = document.getElementById("title");
const icons = document.getElementsByClassName("icon");
const root = document.documentElement;

scene.classList.add("resting");
title.classList.add("resting");
setTimeout(() => {
  scene.classList.remove("resting");
  title.classList.remove("resting");
}, 1000);

function convertToRelative(x, y, width, height) {
  const relativeX = (x - width / 2) / width;
  const relativeY = (y - height / 2) / height;
  return [relativeX, relativeY];
}

document.addEventListener("mousemove", (e) => {
  const window_width = document.documentElement.clientWidth;
  const window_height = document.documentElement.clientHeight;
  const [relativeX, relativeY] = convertToRelative(
    e.pageX,
    e.pageY,
    window_width,
    window_height,
  );
  const angleRad = Math.atan2(relativeY, relativeX);

  // Convert radians to degrees.
  let angleDeg = Math.trunc(angleRad * (180 / Math.PI) + 90);
  if (angleDeg < 0) angleDeg += 360;

  document.getElementById("debug").innerText = `x=${relativeX.toFixed(3)},y=${
    relativeY.toFixed(3)
  },angle=${angleDeg}`;

  const offsetSeverity = 0.01; // higher number for more background movement (0.01)
  const ratioAdjustment = 3 * window_width / window_height; // tune width/height movement (3)
  const xOffset = relativeX * ratioAdjustment * window_width * offsetSeverity;
  const yOffset = relativeY * window_height * offsetSeverity;

  root.style.setProperty("--xPos", `${50 + xOffset}%`);
  root.style.setProperty("--yPos", `${50 + yOffset}%`);
  root.style.setProperty("--gradientAngle", `${angleDeg}deg`);

  for (const icon of icons) {
    const bounds = icon.getBoundingClientRect();
    const midX = bounds.right - (bounds.right - bounds.left) / 2;
    const midY = bounds.bottom - (bounds.bottom - bounds.top) / 2;

    const maxScale = 1.5; // sets maximum size icons grow to (1.5)
    const scaleFactor = 200; // higher number activates icons from further away (200)
    const xtoCursor = Math.abs(midX - e.pageX);
    const ytoCursor = Math.abs(midY - e.pageY);
    const distance = Math.sqrt(xtoCursor ** 2 + ytoCursor ** 2);
    icon.style = `scale: ${
      Math.max(maxScale - distance / scaleFactor, 1).toFixed(3)
    }`;
  }
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
  }, 1000); // todo: fix snapping to new position after 'resting' ends
});
