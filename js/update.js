//-------------------------------------------------------------------------
// 3. UPDATE LOOP
//-------------------------------------------------------------------------

function update(dt) {
  updatePlayer(dt)
  updateBullets(dt)
  updateMonsters(dt)
  checkTreasure()
  checkLiquids()
  // updateDoors(dt)
  checkDoors()

  // ! Vielleicht eigene update Funktion für Musik schreiben
  // theme.level1.play()
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
      else if (player.vul) {
        reduceHitpoints(player, 1)
      }
    }
  }
}

function shoot(player) {
  sfx.shoot.play()
  if (player.shooting) return
  player.shooting = true
  const bulletX = player.x
  const bulletY = player.y
  const direction = player.flipped
  bullets.push({
    originX: bulletX,
    originY: bulletY,
    x: bulletX,
    y: bulletY + player.height / 2,
    directionLeft: direction,
  })
  setTimeout(() => {
    player.shooting = false
  }, 200)
}

function updateBullets(dt) {
  var n, max
  for (n = 0, max = bullets.length; n < max; n++) updateBullet(bullets[n], dt)
}

function updateBullet(bullet, dt) {
  if (!!bullet) {
    if (bullet.directionLeft) {
      bullet.x = bullet.x - ammoType.velocity
    } else {
      bullet.x = bullet.x + ammoType.velocity
    }

    var n, max, monster, thisBullet
    for (n = 0, max = monsters.length; n < max; n++) {
      monster = monsters[n]
      thisBullet = bullet

      if (!monster.dead) {
        if (
          overlap(
            thisBullet.x,
            thisBullet.y,
            ammoType.width,
            ammoType.height,
            monster.x,
            monster.y,
            TILE,
            TILE
          )
        )
          killMonster(monster), sfx.explode.play()
      }
    }
    if (
      (!bullet.directionLeft &&
        bullet.x > bullet.originX + ammoType.distance) ||
      (bullet.directionLeft && bullet.x < bullet.originX - ammoType.distance)
    ) {
      destroyBullet(bullet)
    }
  }
}

function destroyBullet(bullet) {
  const index = bullets.indexOf(bullet)
  if (index > -1) {
    bullets.splice(index, 1)
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

function updateLiquids(dt) {
  var n, max
  for (n = 0, max = liquids.length; n < max; n++)
    updateLiquid(liquids[n], dt), console.log('liquid!')
}

function updateLiquid(liquid, dt) {
  if (overlap(player.x, player.y, TILE, TILE, liquid.x, liquid.y, TILE, TILE)) {
    if (player.dy > 0 && liquid.y - player.y > TILE / 2)
      console.log('swimming!')
  }
}

function checkLiquids() {
  var n, max, l
  for (n = 0, max = liquids.length; n < max; n++) {
    l = liquids[n]

    if (overlap(player.x, player.y, TILE, TILE, l.x, l.y, l.width, l.height)) {
      player.swimming = true
    } else {
      player.swimming = false
    }
  }
}

function checkDoors() {
  // ! Hier habe ich rudimentär einen Levelwechsel eingebaut.
  // ! Was noch fehlt ist, dass ein globales Player-Objekt beibehalten wird.
  var n, max, t
  for (n = 0, max = doors.length; n < max; n++) {
    t = doors[n]
    // console.log('Door ', t)
    if (
      overlap(
        player.x,
        player.y,
        TILE * 2,
        TILE * 2,
        t.x,
        t.y,
        TILE * 2,
        TILE * 2
      )
    )
      player.interact && useDoor(t)
  }
}

function useDoor(t) {
  let leadsTo
  switch (t.leadsTo) {
    case 'level1':
      leadsTo = levelObject.level1
      break
    case 'level2':
      leadsTo = levelObject.level2
      break
  }
  sfx.openDoor.play()
  levelTransition(leadsTo)
}

function levelTransition(level) {
  setTimeout(() => {
    _initLevel(level)
  }, 800)
}

function killMonster(monster) {
  globalObject.killed++
  monster.dead = true
  sfx.killMonster.play()
}

// * Take Damage Function
function reduceHitpoints(entity, damage) {
  if (
    entity.player ? globalObject.hitpoints > 1 : entity.currentHitpoints > 1
  ) {
    entity.player
      ? (globalObject.hitpoints -= damage)
      : (entity.currentHitpoints -= damage)
    entity.vul = false
    entity.hurt = true
    sfx.takeDamage.play()
    setTimeout(() => {
      entity.vul = true
      entity.hurt = false
    }, '1500')
  } else killEntity(entity)
}

function killEntity(entity) {
  console.log('killEntity: ', entity)
  if (entity.player === true) {
    killPlayer(entity)
  }
  if (entity.monster === true) {
    killMonster(monster)
  }
}

function killPlayer(player) {
  sfx.die.play()
  player.x = player.start.x
  player.y = player.start.y
  player.dx = player.dy = 0
  globalObject.hitpoints = player.maxHitpoints
  globalObject.lifes--
  console.log('log globalObject: ', globalObject.lifes)
}

function collectTreasure(t) {
  globalObject.collected++
  t.collected = true
  sfx.pickup.play()
}

function updateEntity(entity, dt) {
  var wasleft = entity.dx < 0,
    wasright = entity.dx > 0,
    falling = entity.falling,
    swimming = entity.swimming || false,
    friction = entity.friction * (falling ? 0.5 : 1),
    accel = entity.accel * (falling ? 0.5 : 1)

  entity.gravity = swimming ? METER * 2 * 6 : METER * 9.8 * 6

  console.log('log entity swimming', swimming)
  console.log('log entity gravity', entity.gravity)
  // ! gravity bei falling stimmt noch nicht
  // ! friction und accel muss bei isSwimming auch noch angepasst werden

  entity.ddx = 0
  entity.ddy = entity.gravity // ! Hier wir gravity angewandt

  // * Hier wird die Entity bewegt.
  if (entity.left) (entity.ddx = entity.ddx - accel), (entity.flipped = true)
  else if (wasleft) entity.ddx = entity.ddx + friction

  if (entity.right) (entity.ddx = entity.ddx + accel), (entity.flipped = false)
  else if (wasright) entity.ddx = entity.ddx - friction

  if (entity.jump && !entity.jumping && !falling) {
    entity.ddy = entity.ddy - entity.impulse // an instant big force impulse
    entity.jumping = true
    sfx.jump.play()
  }

  // ! "dt" ist hier identisch mit "step", was in der index.js in die update() gegeben wird. Konstant bei ca. 0.01666
  //console.log('log entity.x + dt * entity.dx: ', player.x + dt * player.dx)

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
    cell = tcell(tx, ty, mapWidth), //! Was ist das hier?
    cellright = tcell(tx + 1, ty, mapWidth),
    celldown = tcell(tx, ty + 1, mapWidth),
    celldiag = tcell(tx + 1, ty + 1, mapWidth)

  if (entity.player === true) {
    // console.log('log cell: ', cell)
    // console.log('log celldown: ', (celldown && !cell) === true)
  }
  // ? Ist das hier der Collision Check?
  // ? kann ich das umbauen und je nach Flag zurückgeben, was passieren soll?
  // z.B.
  // (Flag 1 = solid)
  // let isSolid = flags.${cell}.includes(1)
  //
  // if (entity.dy > 0) {
  //   if ((celldown && !cell) || (celldiag && !cellright && nx)) {
  // if (isSolid) {
  // entity.y = t2p(ty)
  // entity.dy = 0
  // entity.falling = false
  // entity.jumping = false
  // ny = 0
  // } else if (!isSolid) {
  // entity.y = t2p(ty + 1)
  // entity.dy = 0
  // cell = celldown
  // cellright = celldiag
  // ny = 0
  // }
  //
  // oder sowas.

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
