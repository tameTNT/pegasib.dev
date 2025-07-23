const icons: NodeListOf<HTMLDivElement> = document.querySelectorAll("div.icon");

document.addEventListener("mousemove", (e) => {
  for (const icon of icons) {
    const bounds = icon.getBoundingClientRect();
    const midX = bounds.right - (bounds.right - bounds.left) / 2;
    const midY = bounds.bottom - (bounds.bottom - bounds.top) / 2;

    const maxScale = 1.5; // sets maximum size icons grow to (1.5)
    const scaleFactor = 200; // higher number activates icons from further away (200)
    const xtoCursor = Math.abs(midX - e.pageX);
    const ytoCursor = Math.abs(midY - e.pageY);
    const distance = Math.sqrt(xtoCursor ** 2 + ytoCursor ** 2);
    icon.style.scale = Math.max(maxScale - distance / scaleFactor, 1).toFixed(
      3,
    );
  }
});
