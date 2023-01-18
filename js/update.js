//-------------------------------------------------------------------------
// UPDATE LOOP
//-------------------------------------------------------------------------

function onkey(ev, key, down) {
  switch (key) {
    case KEY.LEFT:
      player.left = down
      ev.preventDefault()
      return false
    case KEY.RIGHT:
      player.right = down
      ev.preventDefault()
      return false
    case KEY.SPACE:
      player.jump = down
      ev.preventDefault()

      return false
  }
}

function update(dt) {
  updatePlayer(dt)
  updateMonsters(dt)
  checkTreasure()
}

function updatePlayer(dt) {
  updateEntity(player, dt)
}

function updateMonsters(dt) {
  var n, max
  for (n = 0, max = monsters.length; n < max; n++)
    updateMonster(monsters[n], dt)
}

function updateMonster(monster, dt) {
  if (!monster.dead) {
    updateEntity(monster, dt)
    if (
      overlap(player.x, player.y, TILE, TILE, monster.x, monster.y, TILE, TILE)
    ) {
      if (player.dy > 0 && monster.y - player.y > TILE / 2) killMonster(monster)
      else killPlayer(player)
    }
  }
}

function checkTreasure() {
  var n, max, t
  for (n = 0, max = treasure.length; n < max; n++) {
    t = treasure[n]
    if (
      !t.collected &&
      overlap(player.x, player.y, TILE, TILE, t.x, t.y, TILE, TILE)
    )
      collectTreasure(t)
  }
}

function killMonster(monster) {
  player.killed++
  monster.dead = true
}

function killPlayer(player) {
  player.x = player.start.x
  player.y = player.start.y
  player.dx = player.dy = 0
}

function collectTreasure(t) {
  player.collected++
  t.collected = true
}

function updateEntity(entity, dt) {
  var wasleft = entity.dx < 0,
    wasright = entity.dx > 0,
    falling = entity.falling,
    friction = entity.friction * (falling ? 0.5 : 1),
    accel = entity.accel * (falling ? 0.5 : 1)

  entity.ddx = 0
  entity.ddy = entity.gravity

  if (entity.left) entity.ddx = entity.ddx - accel
  else if (wasleft) entity.ddx = entity.ddx + friction

  if (entity.right) entity.ddx = entity.ddx + accel
  else if (wasright) entity.ddx = entity.ddx - friction

  if (entity.jump && !entity.jumping && !falling) {
    entity.ddy = entity.ddy - entity.impulse // an instant big force impulse
    entity.jumping = true
  }

  entity.x = entity.x + dt * entity.dx
  entity.y = entity.y + dt * entity.dy
  entity.dx = bound(entity.dx + dt * entity.ddx, -entity.maxdx, entity.maxdx)
  entity.dy = bound(entity.dy + dt * entity.ddy, -entity.maxdy, entity.maxdy)

  if ((wasleft && entity.dx > 0) || (wasright && entity.dx < 0)) {
    entity.dx = 0 // clamp at zero to prevent friction from making us jiggle side to side
  }

  var tx = p2t(entity.x),
    ty = p2t(entity.y),
    nx = entity.x % TILE,
    ny = entity.y % TILE,
    cell = tcell(tx, ty),
    cellright = tcell(tx + 1, ty),
    celldown = tcell(tx, ty + 1),
    celldiag = tcell(tx + 1, ty + 1)

  // ? Ist das hier der Collision Check?
  if (entity.dy > 0) {
    if ((celldown && !cell) || (celldiag && !cellright && nx)) {
      entity.y = t2p(ty)
      entity.dy = 0
      entity.falling = false
      entity.jumping = false
      ny = 0
    }
  } else if (entity.dy < 0) {
    if ((cell && !celldown) || (cellright && !celldiag && nx)) {
      entity.y = t2p(ty + 1)
      entity.dy = 0
      cell = celldown
      cellright = celldiag
      ny = 0
    }
  }

  if (entity.dx > 0) {
    if ((cellright && !cell) || (celldiag && !celldown && ny)) {
      entity.x = t2p(tx)
      entity.dx = 0
    }
  } else if (entity.dx < 0) {
    if ((cell && !cellright) || (celldown && !celldiag && ny)) {
      entity.x = t2p(tx + 1)
      entity.dx = 0
    }
  }

  if (entity.monster) {
    if (entity.left && (cell || !celldown)) {
      entity.left = false
      entity.right = true
    } else if (entity.right && (cellright || !celldiag)) {
      entity.right = false
      entity.left = true
    }
  }

  entity.falling = !(celldown || (nx && celldiag))
}
