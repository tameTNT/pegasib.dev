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
}, 1000)

function convertToRelative(x, y, width, height) {
  const relativeX = (x - width / 2) / width;
  const relativeY = (y - height / 2) / height;
  return [relativeX, relativeY]
}

document.addEventListener("mousemove", (e) => {
  const window_width = document.documentElement.clientWidth;
  const window_height = document.documentElement.clientHeight;
  const [relativeX, relativeY] = convertToRelative(e.pageX, e.pageY, window_width, window_height)
  const angleRad = Math.atan2(relativeY, relativeX);

  // Convert radians to degrees.
  let angleDeg = Math.trunc(angleRad * (180 / Math.PI) + 90);
  if (angleDeg < 0) angleDeg += 360;

  document.getElementById("debug").innerText = `x=${relativeX.toFixed(3)},y=${
    relativeY.toFixed(3)
  },angle=${angleDeg}`;

  const scale = 100;
  const ratioAdjustment = 3 * window_width / window_height;
  const xOffset = relativeX * ratioAdjustment * (window_width / scale);
  const yOffset = relativeY * (window_height / scale);

  root.style.setProperty("--xPos", `${50 + xOffset}%`);
  root.style.setProperty("--yPos", `${50 + yOffset}%`);
  root.style.setProperty("--gradientAngle", `${angleDeg}deg`);

  for (let icon of icons) {
    const bounds = icon.getBoundingClientRect();
    let midX = bounds.right - (bounds.right - bounds.left) / 2;
    let midY = bounds.bottom - (bounds.bottom - bounds.top) / 2;
    [midX, midY] = convertToRelative(midX, midY, window_width, window_height)
    // console.log(midX, midY);

    const prox = 0.15;  // todo: make this relative to offset between icons
    const xtoCursor = Math.abs(midX - relativeX);
    const ytoCursor = Math.abs(midY - relativeY);
    if (xtoCursor < prox && ytoCursor < prox) {
      icon.style = "scale: 1.5";
    } else {
      icon.style = "scale: 1";
    }
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
  }, 1000)  // todo: fix snapping to new position after 'resting' ends
})