//-------------------------------------------------------------------------
// RENDERING
//-------------------------------------------------------------------------

// * Import tiles and level map //
// ! Dies gehört wahrscheinlich in die loadMap.js

const tileAtlas = new Image()
tileAtlas.src = './img/monochrome_tilemap_packed.png'

let tileSize = 16
let tileOutputSize = 2 // can set to 1 for 32px or higher

const level1Atlas = {
  mapsize: { tw: 64, th: 48 },
  tileAtlas: tileAtlas,
  tileSize: 16,
  tileOutputSize: 2,
  updatedTileSize: tileSize * tileOutputSize,
  atlasCol: 20,
  atlasRow: 20,
  mapIndex: 0,
  sourceX: 0,
  sourceY: 0,
}

// * end of Import tiles and level map //

// * Test Sprite Imports

const playerSpriteAtlas = new Image()
playerSpriteAtlas.src = './img/player.png'

const playerAtlas = {
  mapsize: { tw: 64, th: 48 },
  tileAtlas: playerSpriteAtlas,
  tileSize: 16,
  tileOutputSize: 2,
  updatedTileSize: tileSize * tileOutputSize,
  atlasCol: 4,
  atlasRow: 2,
  mapIndex: 0,
  sourceX: 0,
  sourceY: 0,
}

const enemySpriteAtlas = new Image()
enemySpriteAtlas.src = './img/enemies.png'

const enemyAtlas = {
  mapsize: { tw: 64, th: 48 },
  tileAtlas: enemySpriteAtlas,
  tileSize: 16,
  tileOutputSize: 2,
  updatedTileSize: tileSize * tileOutputSize,
  atlasCol: 4,
  atlasRow: 3,
  mapIndex: 0,
  sourceX: 0,
  sourceY: 0,
}

const itemsSpriteAtlas = new Image()
itemsSpriteAtlas.src = './img/items.png'

const itemsAtlas = {
  mapsize: { tw: 64, th: 48 },
  tileAtlas: itemsSpriteAtlas,
  tileSize: 16,
  tileOutputSize: 2,
  updatedTileSize: tileSize * tileOutputSize,
  atlasCol: 4,
  atlasRow: 4,
  mapIndex: 0,
  sourceX: 0,
  sourceY: 0,
}

// * End Test Sprite Imports

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
  renderMap(ctx, level1Atlas)
  renderTreasure(ctx, itemsAtlas, dt, frame)
  renderPlayer(ctx, playerAtlas, dt, frame)

  renderMonsters(ctx, enemyAtlas, dt, frame)

  // * Draw CameraBox
  //renderCameraBox()
  ctx.restore()
  renderPause()
  renderHud(ctx, frame)
  renderHudSprites()
  renderDevInfos()
}

// Map Limit Variables

// * Das hier ist die allgemeine Funktion um Tiles aus dem TileAtlas auf den Canvas zu malen.
function drawTile(levelAtlas, cell, dx, dy) {
  levelAtlas.sourceY =
    Math.floor(cell / levelAtlas.atlasCol) * levelAtlas.tileSize
  levelAtlas.sourceX = (cell % levelAtlas.atlasCol) * levelAtlas.tileSize
  // ? Wofür stehen die Werte sWidth, sHeight, dWidth, dHeight
  ctx.drawImage(
    levelAtlas.tileAtlas,
    levelAtlas.sourceX,
    levelAtlas.sourceY,
    16,
    16,
    dx * 32,
    dy * 32,
    32,
    32
  )
}

function renderMap(ctx, levelAtlas) {
  var x, y, cell
  for (y = 0; y < MAP.th; y++) {
    for (x = 0; x < MAP.tw; x++) {
      cell = tcell(x, y)
      if (cell) {
        ctx.fillStyle = COLORS[cell - 1]
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE)

        // * Malt das Tile aus der TileMap

        drawTile(levelAtlas, cell, x, y)
      }
    }
  }
}

// * Sprite Animation
function drawSprite(entity, spriteAtlas, dt, frame) {
  const sprites = entity.sprites

  let isJumping = entity.jumping || entity.falling

  let isRunning =
    (entity.right === true && !isJumping) ||
    (entity.left === true && !isJumping)

  let sprite = isRunning
    ? sprites.run
    : !!sprites.jump && isJumping
    ? sprites.jump
    : sprites.idle

  const x = entity.x + entity.dx * dt
  const y = entity.y + entity.dy * dt
  const flipped = entity.flipped
  const width = entity.width
  const height = entity.height

  function updateFrames() {
    if (frame % sprite.framebuffer === 0) {
      if (sprite.currentFrame < sprite.tiles.length - 1) sprite.currentFrame++
      else if (sprite.loop) sprite.currentFrame = 0
    }
  }

  let spriteTile = sprite.tiles[sprite.currentFrame]

  // make an image position using the
  // current row and colum
  spriteAtlas.sourceY =
    Math.floor(spriteTile / spriteAtlas.atlasCol) * spriteAtlas.tileSize
  spriteAtlas.sourceX =
    (spriteTile % spriteAtlas.atlasCol) * spriteAtlas.tileSize

  ctx.save()
  // * Flip Sprite
  ctx.scale(flipped ? -1 : 1, 1)
  let dx = flipped ? -x - width : x

  ctx.drawImage(
    spriteAtlas.tileAtlas,
    spriteAtlas.sourceX,
    spriteAtlas.sourceY,
    16, // * source Höhe
    16, // * source Breite
    dx,
    y,
    width, // * player Höhe
    height // * player Breite
  )
  ctx.restore()
  updateFrames()
}

// * Render Player
function renderPlayer(ctx, spriteAtlas, dt, frame) {
  if (player.vul === false) {
    ctx.globalAlpha = 0.25 + tweenTreasure(frame * 3, 60)
  }
  drawSprite(player, spriteAtlas, dt, frame)
  ctx.fillStyle = COLOR.YELLOW
  // ctx.fillRect(player.x + player.dx * dt, player.y + player.dy * dt, TILE, TILE)
  ctx.globalAlpha = 1
}

function renderHud(ctx, frame) {
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

  // ! provisorische Hitpoint-Anzeige
  ctx.fillStyle = 'red'
  if (player.currenthitpoints === 1) {
    ctx.globalAlpha = 0.25 + tweenTreasure(frame, 60)
  }
  for (n = 0, max = player.currenthitpoints; n < max; n++)
    ctx.fillRect(
      t2p(1 + n) * hudScaling,
      t2p(3) * hudScaling,
      (TILE / 2) * hudScaling,
      (TILE / 2) * hudScaling
    )
  ctx.globalAlpha = 1
}

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

function renderMonsters(ctx, spriteAtlas, dt, frame) {
  ctx.fillStyle = COLOR.SLATE
  var n, max, monster
  for (n = 0, max = monsters.length; n < max; n++) {
    monster = monsters[n]

    if (monster.sprites === undefined && !monster.dead)
      ctx.fillRect(
        monster.x + monster.dx * dt,
        monster.y + monster.dy * dt,
        TILE,
        TILE
      )
    if (monster.sprites !== undefined && !monster.dead) {
      drawSprite(monster, spriteAtlas, dt, frame)
    }
  }
}

function renderTreasure(ctx, spriteAtlas, dt, frame) {
  ctx.fillStyle = COLOR.GOLD
  ctx.globalAlpha = 0.25 + tweenTreasure(frame, 60)
  var n, max, t
  for (n = 0, max = treasure.length; n < max; n++) {
    t = treasure[n]
    //if (!t.collected) ctx.fillRect(t.x, t.y + TILE / 3, TILE, (TILE * 2) / 3)

    if (t.sprites !== undefined && !t.collected) {
      drawSprite(t, spriteAtlas, dt, frame)
    }
  }
  ctx.globalAlpha = 1
}

function tweenTreasure(frame, duration) {
  const half = duration / 2
  pulse = frame % duration
  return pulse < half ? pulse / half : 1 - (pulse - half) / half
}
