document.addEventListener("mousemove", (e) => {
    let window_width = document.documentElement.clientWidth
    let window_height = document.documentElement.clientHeight
    let relativeX = (e.pageX - window_width/2) / window_width
    let relativeY = (e.pageY - window_height/2) / window_height

    let scale = 100
    let ratioAdjustment = 3 * window_width / window_height
    let xOffset = relativeX * ratioAdjustment * (window_width / scale)
    let yOffset = relativeY * (window_height / scale)

    let scene = document.getElementById("scene")
    scene.style.backgroundPosition = `${50+xOffset}% ${50+yOffset}%`
})