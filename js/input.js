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
      // console.log('log Key X')
      shouldPanCameraDown({ canvas, cameraWithBox })
      ev.preventDefault()
      return false
    case KEY.Y:
      console.log('log shoot')
      //  player.shooting = down
      shoot(player)
      ev.preventDefault()
      return false
    case KEY.UP:
      console.log('log Key Up')
      player.up = down
      shouldPanCameraDown({ canvas, cameraWithBox })
      ev.preventDefault()
      return false
    case KEY.DOWN:
      console.log('log Key Down')
      player.down = down
      ev.preventDefault()
      return false
    case KEY.ENTER:
      console.log('log Key Enter')
      player.interact = down
      ev.preventDefault()
      return false
    case KEY.SPACE:
      console.log('log Key Space')
      ev.preventDefault()
      return false
  }
}
