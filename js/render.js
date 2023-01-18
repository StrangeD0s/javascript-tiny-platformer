//-------------------------------------------------------------------------
// RENDERING
//-------------------------------------------------------------------------

function render(ctx, frame, dt) {
  // * scale und translate funktioniert! Ich brauche nur noch eine Camera!
  // ? Kann ich mich eigentlich mit scale und translate noch weiter an Pico-8 orientieren und in den variables sowas wie scale = ctx.scale oder so erstellen?
  // ctx.save();
  // ctx.scale(2, 2);
  // ctx.translate(0, -200);
  ctx.clearRect(0, 0, width, height)
  renderMap(ctx)
  renderTreasure(ctx, frame)
  renderPlayer(ctx, dt)
  renderMonsters(ctx, dt)
  // ctx.restore();
}

function renderMap(ctx) {
  var x, y, cell
  for (y = 0; y < MAP.th; y++) {
    for (x = 0; x < MAP.tw; x++) {
      cell = tcell(x, y)
      if (cell) {
        ctx.fillStyle = COLORS[cell - 1]
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE)
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
  var half = duration / 2
  pulse = frame % duration
  return pulse < half ? pulse / half : 1 - (pulse - half) / half
}
