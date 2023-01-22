//-------------------------------------------------------------------------
// RENDERING
//-------------------------------------------------------------------------

// Map Limit Variables

// * Pause Function
function renderPause() {
  if (paused) {
    ctx.font = '65px Arial'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText('- pause -', canvas.width / 2, canvas.height / 2)
  }
}

function renderCameraBox() {
  ctx.fillStyle = 'rgba(0, 0, 255, 0.2)'
  ctx.fillRect(cameraBox.x, cameraBox.y, cameraBox.width, cameraBox.height)
}

function render(ctx, frame, dt) {
  // * scale und translate funktioniert! Ich brauche nur noch eine Camera!
  // ? Kann ich mich eigentlich mit scale und translate noch weiter an Pico-8 orientieren und in den variables sowas wie scale = ctx.scale oder so erstellen?
  ctx.save()
  ctx.scale(2, 2)
  ctx.clearRect(0, 0, width, height)
  //renderCamera()
  renderCameraWithBox()
  renderMap(ctx)
  renderTreasure(ctx, frame)
  renderPlayer(ctx, dt)
  renderMonsters(ctx, dt)

  // * Draw CameraBox
  renderCameraBox()
  ctx.restore()
  renderPause()
  renderDevInfos()
}

// * Import tiles and level map //
// ! Dies gehört wahrscheinlich in die loadMap.js

const tileAtlas = new Image()
tileAtlas.src = './img/monochrome_tilemap_packed.png'

let tileSize = 16
let tileOutputSize = 2 // can set to 1 for 32px or higher
let updatedTileSize = tileSize * tileOutputSize

let atlasCol = 20
let atlasRow = 20

let mapIndex = 0
let sourceX = 0
let sourceY = 0

// * end of Import tiles and level map //

// * Das hier ist die allgemeine Funktion um Tiles aus dem TileAtlas auf den Canvas zu malen.
// ? Macht es Sinn, den tileAtlas auch als Variable reinzugeben? Dann kann ich den je nach Level anpassen.
function drawTile(cell, dx, dy) {
  sourceY = Math.floor(cell / atlasCol) * tileSize
  sourceX = (cell % atlasCol) * tileSize
  // ? Wofür stehen die Werte sWidth, sHeight, dWidth, dHeight
  ctx.drawImage(tileAtlas, sourceX, sourceY, 16, 16, dx * 32, dy * 32, 32, 32)
}

function renderMap(ctx) {
  var x, y, cell
  for (y = 0; y < MAP.th; y++) {
    for (x = 0; x < MAP.tw; x++) {
      cell = tcell(x, y)
      if (cell) {
        ctx.fillStyle = COLORS[cell - 1]
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE)

        // * Die folgende Funktion funktioniert! Vorerst deaktiviert, bis ich die Map angepasst habe.
        // drawTile(cell, x, y)
      }
    }
  }
}

function renderPlayer(ctx, dt) {
  ctx.fillStyle = COLOR.YELLOW
  ctx.fillRect(player.x + player.dx * dt, player.y + player.dy * dt, TILE, TILE)

  var n, max

  ctx.fillStyle = COLOR.GOLD
  for (n = 0, max = player.collected; n < max; n++)
    ctx.fillRect(t2p(2 + n), t2p(2), TILE / 2, TILE / 2)
  /* sourceY = Math.floor(cell / atlasCol) * tileSize
  sourceX = (cell % atlasCol) * tileSize */

  ctx.fillStyle = COLOR.SLATE
  for (n = 0, max = player.killed; n < max; n++)
    ctx.fillRect(t2p(2 + n), t2p(3), TILE / 2, TILE / 2)
}

function renderMonsters(ctx, dt) {
  ctx.fillStyle = COLOR.SLATE
  var n, max, monster
  for (n = 0, max = monsters.length; n < max; n++) {
    monster = monsters[n]
    if (!monster.dead)
      ctx.fillRect(
        monster.x + monster.dx * dt,
        monster.y + monster.dy * dt,
        TILE,
        TILE
      )
  }
}

function renderTreasure(ctx, frame) {
  ctx.fillStyle = COLOR.GOLD
  ctx.globalAlpha = 0.25 + tweenTreasure(frame, 60)
  var n, max, t
  for (n = 0, max = treasure.length; n < max; n++) {
    t = treasure[n]
    if (!t.collected) ctx.fillRect(t.x, t.y + TILE / 3, TILE, (TILE * 2) / 3)
  }
  ctx.globalAlpha = 1
}

function tweenTreasure(frame, duration) {
  const half = duration / 2
  pulse = frame % duration
  return pulse < half ? pulse / half : 1 - (pulse - half) / half
}
