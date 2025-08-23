import { isVPSmallerThanmd } from "./common.ts";

// == Background movement and gradient angle effect ==
const scene = document.getElementById("spaceScene");
const title = document.querySelector("h1");
const root = document.documentElement;

function convertToRelative(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const relativeX = (x - width / 2) / width;
  const relativeY = (y - height / 2) / height;
  return [relativeX, relativeY];
}

if (scene !== null && title !== null) {
  scene.classList.add("resting");
  title.classList.add("resting");
  setTimeout(() => {
    scene.classList.remove("resting");
    title.classList.remove("resting");
  }, 1000);

  document.addEventListener("mousemove", (e) => {
    const window_width = document.documentElement.clientWidth;
    const window_height = document.documentElement.clientHeight;
    if (isVPSmallerThanmd()) return; // don't move background/gradient on small breakpoints
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

    const debugEl = document.getElementById("debug");
    if (debugEl !== null) {
      debugEl.innerText = `x=${relativeX.toFixed(3)},y=${
        relativeY.toFixed(3)
      },angle=${angleDeg}`;
    }

    const offsetSeverity = 0.005; // higher number for more background movement (0.01)
    const ratioAdjustment = 3 * window_width / window_height; // tune width/height movement (3)
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
    }, 1000); // todo: fix snapping to new position after 'resting' ends
  });
}

// == Icon grow effect on cursor proximity ==
const icons: NodeListOf<HTMLDivElement> = document.querySelectorAll("div.icon");

document.addEventListener("mousemove", (e) => {
  for (const icon of icons) {
    const bounds = icon.getBoundingClientRect();
    const midX = bounds.right - (bounds.right - bounds.left) / 2;
    const midY = bounds.bottom - (bounds.bottom - bounds.top) / 2;

    let maxScale: number;
    let scaleFactor: number;
    if (isVPSmallerThanmd()) { // small screens stack icons in column
      maxScale = 1.3;
      scaleFactor = 100;
    } else { // large screens have icons in a row
      maxScale = 1.5; // sets maximum size icons grow to (1.5)
      scaleFactor = 200; // higher number activates icons from further away (200)
    }
    const xtoCursor = Math.abs(midX - e.pageX);
    const ytoCursor = Math.abs(midY - e.pageY);
    const distance = Math.sqrt(xtoCursor ** 2 + ytoCursor ** 2);
    icon.style.scale = Math.max(maxScale - distance / scaleFactor, 1).toFixed(
      3,
    );
  }
});

// Required default export to let this be a Fresh plugin (see docs)
// deno-lint-ignore no-explicit-any
export default function (_foo: any) {};
