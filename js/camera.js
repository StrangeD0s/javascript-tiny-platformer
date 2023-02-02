//-------------------------------------------------------------------------
// 3.2 Simple CAMERA
//-------------------------------------------------------------------------

function renderCamera() {
  // ! Ich muss diese Funktion gegen eine mit CameraBox austauschen. Diese kann ich aber für TopDown/Overworld Level benutzen.

  //console.log('log camera width: ', width)
  //console.log('log camera scaledCanvas.width: ', scaledCanvas.width)

  const camera = {
    get x() {
      if (player.x < scaledCanvas.width) return 0
      if (player.x > width - scaledCanvas.width)
        return -(width - scaledCanvas.width * 2)
      else return -(player.x - scaledCanvas.width)
    },
    get y() {
      if (player.y < scaledCanvas.height) return 0
      if (player.y > height - scaledCanvas.height)
        return -(height - scaledCanvas.height * 2)
      else return -(player.y - scaledCanvas.height)
    },
  }

  ctx.translate(camera.x, camera.y)
}

//-------------------------------------------------------------------------
// Box CAMERA
//-------------------------------------------------------------------------

let cameraWithBox = {
  position: {
    x: 0,
    y: 0,
  },
}

function renderCameraWithBox() {
  //console.log('log renderCameraWithBox position.x: ', cameraWithBox.position.x)
  ctx.translate(cameraWithBox.position.x, cameraWithBox.position.y)
}

const cameraBox = {
  // ! Die Werte stimme nur ungefähr, geben mir aber eine grobe CameraBox zurück.
  get x() {
    return -(canvas.width / 2 / 2 - 100 - player.x)
  },
  get y() {
    return -(canvas.height / 2 / 2 - 150 - player.y)
  },
  width: canvas.width / 2 - 200,
  height: canvas.height / 2 - 300,
}

// ! "camera" muss ich dann in der renderCamera() in der render Funktion anpassen.
// ? Woher kommt this.velocity ?

function shouldPanCameraToTheLeft({ canvas, camera }) {
  const cameraboxRightSide = cameraBox.x + cameraBox.width
  const scaledDownCanvasWidth = canvas.width / 2

  // console.log('log cameraboxRightSide: ', cameraboxRightSide)
  //console.log('log cameraboxRightSide >= 2048: ', cameraboxRightSide >= 2048)
  // ! Woher kommt der Wert hier?
  if (cameraboxRightSide >= 2048) return

  //console.log('log player.x: ', player.x)

  //console.log('log scaledDownCanvasWidth: ', scaledDownCanvasWidth)

  /* console.log(
    'log shouldPanCameraToTheLeft: ',
    cameraboxRightSide >= scaledDownCanvasWidth
  ) */

  if (
    cameraboxRightSide >=
    scaledDownCanvasWidth + Math.abs(cameraWithBox.position.x)
  ) {
    cameraWithBox.position.x -= player.x - canvas.width / 2 / 2
  }
}

function shouldPanCameraToTheRight({ canvas, cameraprop }) {
  //console.log('log shouldPanCameraToTheRight')
  //console.log('log entity x update: ', (player.x + step * player.dx).toFixed(2))
  //console.log('log cameraBox.x <= 0: ', cameraBox.x <= 0)
  if (cameraBox.x <= 0) return

  if (cameraBox.x <= Math.abs(cameraWithBox.position.x)) {
    cameraWithBox.position.x = cameraWithBox.position.x--
  }
}

function shouldPanCameraDown({ canvas, camera }) {
  //console.log('log shouldPanCameraDown')
  /* if (cameraBox.position.y + this.velocity.y <= 0) return

  if (cameraBox.position.y <= Math.abs(camera.position.y)) {
    camera.position.y -= this.velocity.y
  } */
}

function shouldPanCameraUp({ canvas, camera }) {
  // console.log('log shouldPanCameraUp')
  /* if (cameraBox.position.y + cameraBox.height + this.velocity.y >= 432) return

  const scaledCanvasHeight = canvas.height / 4

  if (
    cameraBox.position.y + cameraBox.height >=
    Math.abs(camera.position.y) + scaledCanvasHeight
  ) {
    camera.position.y -= this.velocity.y
  } */
}
