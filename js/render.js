//-------------------------------------------------------------------------
// 4. RENDERING
//-------------------------------------------------------------------------

function render(ctx, frame, dt, thiscurrentLevel) {
  // ? Kann ich mich eigentlich mit scale und translate noch weiter an Pico-8 orientieren und in den variables sowas wie scale = ctx.scale oder so erstellen?
  // * Disable Image Smoothing
  ctx.mozImageSmoothingEnabled = false
  ctx.webkitImageSmoothingEnabled = false
  ctx.msImageSmoothingEnabled = false
  ctx.imageSmoothingEnabled = false
  ctx.save()
  ctx.scale(
    thiscurrentLevel.scalingFactor / 2,
    thiscurrentLevel.scalingFactor / 2
  )

  ctx.clearRect(0, 0, width, height)
  renderCamera()
  //renderCameraWithBox()
  renderMap(ctx, thiscurrentLevel.levelAtlas)
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
  // ! Kann ich die ganzen festen Zahlen als Variablen aus der Map holen?
  ctx.drawImage(
    levelAtlas.tileAtlas,
    levelAtlas.sourceX,
    levelAtlas.sourceY,
    16,
    16,
    dx * 16,
    dy * 16,
    16,
    16
  )
}

function renderMap(ctx, levelAtlas) {
  var x, y, cell
  for (y = 0; y < mapHeight; y++) {
    for (x = 0; x < mapWidth; x++) {
      cell = tcell(x, y, mapWidth)
      if (cell) {
        ctx.fillStyle = COLORS[cell - 1]
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE)

        // * Malt das Tile aus der TileMap

        drawTile(levelAtlas, cell - 1, x, y)
      }
    }
  }
}

// * Sprite Animation
function drawSprite(entity, spriteAtlas, dt, frame) {
  /* entity.start.x === 48 &&
    entity.start.y === 656 &&
    console.log('log frame ', entity.sprites.idle)
 */
  const sprites = entity.sprites

  let isJumping = entity.jumping || entity.falling

  let isRunning =
    (entity.right === true && !isJumping) ||
    (entity.left === true && !isJumping)

  let sprite =
    !!sprites.run && isRunning
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
    entity.start.x === 48 &&
      entity.start.y === 656 &&
      console.log('log  frame ', entity)

    if (frame % sprite.framebuffer === 0) {
      if (sprite.currentFrame + 1 < sprite.tiles.length) sprite.currentFrame++
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
  const hudScaling = scalingFactor / 2

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
  if (player.currentHitpoints === 1) {
    ctx.globalAlpha = 0.25 + tweenTreasure(frame, 60)
  }
  for (n = 0, max = player.currentHitpoints; n < max; n++)
    ctx.fillRect(
      t2p(1 + n) * hudScaling,
      t2p(3) * hudScaling,
      (TILE / 2) * hudScaling,
      (TILE / 2) * hudScaling
    )
  ctx.globalAlpha = 1
}

// * Render Pause Function
function renderPause() {
  if (paused) {
    ctx.save()
    ctx.scale(scalingFactor / 2, scalingFactor / 2)

    ctx.font = '12px C64 TrueType'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText('- pause -', scaledCanvas.width, scaledCanvas.height)
    ctx.restore()
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
