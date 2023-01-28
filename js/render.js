//-------------------------------------------------------------------------
// RENDERING
//-------------------------------------------------------------------------

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
  // ? Kann ich mich eigentlich mit scale und translate noch weiter an Pico-8 orientieren und in den variables sowas wie scale = ctx.scale oder so erstellen?
  // * Disable Image Smoothing
  ctx.mozImageSmoothingEnabled = false
  ctx.webkitImageSmoothingEnabled = false
  ctx.msImageSmoothingEnabled = false
  ctx.imageSmoothingEnabled = false
  ctx.save()
  ctx.scale(scalingFactor / 2, scalingFactor / 2)
  ctx.clearRect(0, 0, width, height)
  renderCamera()
  //renderCameraWithBox()
  renderMap(ctx)
  renderTreasure(ctx, frame)
  renderPlayer(ctx, dt, frame)

  renderMonsters(ctx, dt)

  // * Draw CameraBox
  //renderCameraBox()
  ctx.restore()
  renderPause()
  renderHud(ctx)
  renderDevInfos()
}

// Map Limit Variables

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

        // * Malt das Tile aus der TileMap

        drawTile(cell, x, y)
      }
    }
  }
}

// * Sprite Animation Test

// ! framerate, frameBuffer und loop wird später eine prop des player/entity Objekts

// ! Die funktioniert schon, ich brauche nur eine Art Übersetzung vom Spritesheet zum sprite. Vielleicht die tatsächlichen Tile Positionen in einem Sprite Objekt sammeln. Vielleicht sogar im Player Objekt. Die Length ist dann auch Teil des Sprite Objects

function drawSprite(entity, dt, frame) {
  const sprite = entity.sprites
  const x = entity.x + entity.dx * dt
  const y = entity.y + entity.dy * dt

  const frameRate = sprite.framerate
  const frameBuffer = sprite.framebuffer
  const loop = sprite.loop

  function updateFrames() {
    if (frame % frameBuffer === 0) {
      if (sprite.currentFrame < frameRate - 1) sprite.currentFrame++
      else if (loop) sprite.currentFrame = 0
    }
  }

  let spriteTile = sprite.tile
  let animationLength = sprite.length
  if ((spriteTile = spriteTile + animationLength)) {
    spriteTile
  }
  spriteTile += sprite.currentFrame

  // make an image position using the
  // current row and colum
  sourceY = Math.floor(spriteTile / atlasCol) * tileSize
  sourceX = (spriteTile % atlasCol) * tileSize

  ctx.drawImage(
    tileAtlas, // ! Variable daraus machen!
    sourceX,
    sourceY,
    16, // * source Höhe
    16, // * source Breite
    x,
    y,
    32, // * player Höhe
    32 // * player Breite
  )
  updateFrames()
}

// * Sprite Animation Test End

function renderPlayer(ctx, dt, frame) {
  ctx.fillStyle = COLOR.YELLOW
  //ctx.fillRect(player.x + player.dx * dt, player.y + player.dy * dt, TILE, TILE)

  drawSprite(player, dt, frame)
}

function renderHud(ctx) {
  var n, max
  const hudScaling = 4

  ctx.fillStyle = COLOR.GOLD
  for (n = 0, max = player.collected; n < max; n++)
    ctx.fillRect(
      t2p(1 + n) * hudScaling,
      t2p(1) * hudScaling,
      (TILE / 2) * hudScaling,
      (TILE / 2) * hudScaling
    )

  ctx.fillStyle = COLOR.SLATE
  for (n = 0, max = player.killed; n < max; n++)
    ctx.fillRect(
      t2p(1 + n) * hudScaling,
      t2p(2) * hudScaling,
      (TILE / 2) * hudScaling,
      (TILE / 2) * hudScaling
    )
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
