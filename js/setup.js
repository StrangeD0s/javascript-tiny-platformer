//-------------------------------------------------------------------------
// 5. LOAD THE MAP
//-------------------------------------------------------------------------

// ! Wenn ich die Setup-Funktion zum Levelwechsel aufrufe, dann werden die Variablen nicht upgedated!

// * Die setup Funktion finde ich gut, weil sie alle Infos aus einer map mit mehreren Layern erhalten kann.
function setup(map) {
  var background = map.layers[0]?.data,
    data = map.layers[1].data,
    objects = map.layers[2].objects,
    foreground = map.layers[3]?.data,
    liquidTiles = map.layers[4]?.data || null,
    n,
    obj,
    entity

  for (n = 0; n < objects.length; n++) {
    obj = objects[n]

    const entityType = obj.type || obj.class

    const entityProperties = Array.isArray(obj.properties)
      ? Object.fromEntries(
          !!obj.properties &&
            obj.properties?.map((obj) => [obj.name, obj.value])
        )
      : !!obj.properties
      ? obj.properties
      : {}

    // * Hier werden alle actors/entities in die entsprechenden Ojekte gepushed.
    entity = setupEntity(obj, entityType, entityProperties)

    switch (entityType) {
      case 'player':
        player = entity
        break
      case 'monster':
        monsters.push(entity)
        break
      case 'treasure':
        treasure.push(entity)
        break

      case 'ammo':
        pickups.push(entity)
        break
      case 'health':
        pickups.push(entity)
        break
      case 'extralife':
        pickups.push(entity)
        break

      case 'water':
        liquids.push(entity)
        break
      case 'door':
        doors.push(entity)
        break
    }
  }

  cells = data
  bgCells = background
  fgCells = foreground
  lqCells = liquidTiles
}

// * Diese Funktion entspricht grob meiner actor init Funktion.
// ? Muss ich noch eine Sprite Animation Funktion erstellen, die ihre Daten aus dem Entity Object für alle Entities (player, monster, etc.) erhält?
function setupEntity(obj, entityType, entityProperties) {
  let entitySprites =
    entityType == 'monster'
      ? bounderMonster.sprites
      : entityType == 'player'
      ? playerObject.sprites
      : entityType == 'treasure'
      ? coinTreasure.sprites
      : entityType == 'ammo'
      ? ammo.sprites
      : entityType == 'health'
      ? health.sprites
      : entityType == 'extralife'
      ? extralife.sprites
      : entityType == 'door'
      ? null
      : null

  const entityMaxHitpoints =
    entityType == 'player' ? playerObject.maxHitpoints : null

  const entityCurrentHitpoints =
    entityType == 'player' ? playerObject.currentHitpoints : null

  var entity = {}
  entity.x = obj.x
  entity.y = obj.y
  entity.dx = 0
  entity.dy = 0
  entity.gravity = METER * (entityProperties.gravity || GRAVITY)
  entity.maxdx = METER * (entityProperties.maxdx || MAXDX)
  entity.maxdy = METER * (entityProperties.maxdy || MAXDY)
  entity.impulse = METER * (entityProperties.impulse || IMPULSE)
  entity.accel = entity.maxdx / (entityProperties.accel || ACCEL)
  entity.friction = entity.maxdx / (entityProperties.friction || FRICTION)
  entity.monster = entityType == 'monster'
  entity.player = entityType == 'player'
  entity.treasure = entityType == 'treasure'
  entity.ammo = entityType == 'ammo'
  entity.health = entityType == 'health'
  entity.extralife = entityType == 'extralife'
  entity.water = entityType == 'water'
  entity.door = entityType == 'door'
  entity.leadsTo = entityProperties.leadsTo
  entity.left = entityProperties.left
  entity.right = entityProperties.right
  entity.up = entityProperties.up || false
  entity.down = entityProperties.down || false
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
