//-------------------------------------------------------------------------
// 3.1 INPUT
//-------------------------------------------------------------------------

function onkey(ev, key, down) {
  switch (key) {
    case KEY.LEFT:
      player.left = down
      shouldPanCameraToTheRight({ canvas, cameraWithBox })
      ev.preventDefault()
      return false
    case KEY.RIGHT:
      player.right = down
      shouldPanCameraToTheLeft({ canvas, cameraWithBox })
      ev.preventDefault()
      return false
    case KEY.X:
      player.jump = down
      shouldPanCameraDown({ canvas, cameraWithBox })
      ev.preventDefault()
      return false
  }
}
