//-------------------------------------------------------------------------
// 5. LOAD THE MAP
//-------------------------------------------------------------------------

// ! Wenn ich die Setup-Funktion zum Levelwechsel aufrufe, dann werden die Variablen nicht upgedated!

// * Die setup Funktion finde ich gut, weil sie alle Infos aus einer map mit mehreren Layern erhalten kann.
function setup(map) {
  // ! Hier muss ich noch mehr Variablen anlegen. "data" hat nur den bisherigen TileLayer. Wenn ich noch Background und Foreground haben will, brauche ich dafür auch Variablen.
  var data = map.layers[0].data,
    objects = map.layers[1].objects,
    background = map.layers[2]?.background,
    foreground = map.layers[3]?.foreground,
    n,
    obj,
    entity

  for (n = 0; n < objects.length; n++) {
    obj = objects[n]
    // * Hier werden alle actors/entities in die entsprechenden Ojekte gepushed.
    entity = setupEntity(obj)
    switch (obj.type) {
      case 'player':
        player = entity
        break
      case 'monster':
        monsters.push(entity)
        break
      case 'treasure':
        treasure.push(entity)
      case 'door':
        doors.push(entity)
        break
    }
  }

  cells = data
}

// * Diese Funktion entspricht grob meiner actor init Funktion.
// ? Muss ich noch eine Sprite Animation Funktion erstellen, die ihre Daten aus dem Entity Object für alle Entities (player, monster, etc.) erhält?
function setupEntity(obj) {
  let entitySprites =
    obj.type == 'monster'
      ? bounderMonster.sprites
      : obj.type == 'player'
      ? playerObject.sprites
      : obj.type == 'treasure'
      ? coinTreasure.sprites
      : null

  const entityMaxHitpoints =
    obj.type == 'player' ? playerObject.maxHitpoints : null

  const entityCurrentHitpoints =
    obj.type == 'player' ? playerObject.currentHitpoints : null

  var entity = {}
  entity.x = obj.x
  entity.y = obj.y
  entity.dx = 0
  entity.dy = 0
  entity.gravity = METER * (obj.properties.gravity || GRAVITY)
  entity.maxdx = METER * (obj.properties.maxdx || MAXDX)
  entity.maxdy = METER * (obj.properties.maxdy || MAXDY)
  entity.impulse = METER * (obj.properties.impulse || IMPULSE)
  entity.accel = entity.maxdx / (obj.properties.accel || ACCEL)
  entity.friction = entity.maxdx / (obj.properties.friction || FRICTION)
  entity.monster = obj.type == 'monster'
  entity.player = obj.type == 'player'
  entity.treasure = obj.type == 'treasure'
  entity.left = obj.properties.left
  entity.right = obj.properties.right
  entity.start = { x: obj.x, y: obj.y }
  entity.killed = entity.collected = 0
  entity.sprites = entitySprites
  entity.flipped = false
  entity.width = obj.width
  entity.height = obj.height
  entity.maxHitpoints = entityMaxHitpoints
  entity.currentHitpoints = entityCurrentHitpoints
  entity.hurt = false
  entity.vul = true

  return entity
}
