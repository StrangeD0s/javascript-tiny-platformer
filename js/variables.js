//-------------------------------------------------------------------------
// 2. GAME CONSTANTS AND VARIABLES
//-------------------------------------------------------------------------

// * Import tiles and level map //

const tileAtlas = new Image()
tileAtlas.src = './img/monochrome_tilemap_packed.png'

const tileAtlas2 = new Image()
tileAtlas2.src = './img/tiles.png'

const tileAtlas3 = new Image()
tileAtlas3.src = './img/Grotto-escape-2-files/PNG/environment-tiles.png'

const tileAtlasBg = new Image()
tileAtlasBg.src = './img/Grotto-escape-2-files/PNG/environment-background.png'

let tileSize = 16
let tileOutputSize = 2 // can set to 1 for 32px or higher

const level1Atlas = {
  tileAtlas: tileAtlas2,
  tileSize: 16,
  tileOutputSize: 2,
  updatedTileSize: tileSize * tileOutputSize,
  atlasCol: 8,
  atlasRow: 5,
  mapIndex: 0,
  sourceX: 0,
  sourceY: 0,
}

const level2Atlas = {
  tileAtlas: tileAtlas3,
  tileSize: 16,
  tileOutputSize: 2,
  updatedTileSize: tileSize * tileOutputSize,
  atlasCol: 42,
  atlasRow: 16,
  mapIndex: 0,
  sourceX: 0,
  sourceY: 0,
}

const backgroundAtlas = {
  tileAtlas: tileAtlasBg,
  tileSize: 16,
  tileOutputSize: 2,
  updatedTileSize: tileSize * tileOutputSize,
  atlasCol: 28,
  atlasRow: 10,
  mapIndex: 0,
  sourceX: 0,
  sourceY: 0,
}

// * end of Import tiles and level map //

// * Test Sprite Imports

const playerSpriteAtlas = new Image()
playerSpriteAtlas.src = './img/player.png'

const playerAtlas = {
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

// * Das currentLevel Objekt sollte durch irgendeine Funktion befüllt werden, wenn ein Level gewechselt wird.

let levelObject = {
  level1: {
    scalingFactor: 8,
    levelData: level1,
    levelAtlas: level1Atlas,
    playerStartCoordinates: { x: 96, y: 480 }, // * Für wenn man das Level durch eine Tür erneut betritt.
  },
  level2: {
    scalingFactor: 3.5,
    levelData: level2,
    levelAtlas: level2Atlas,
    playerStartCoordinates: { x: 96, y: 480 }, // * Für wenn man das Level durch eine Tür erneut betritt.
  },
}

let currentLevel = levelObject.level1 // ! hier kann ich noch eine function draus machen, die das currentLevel immer auf dem aktuellen Stand hält. Vorläufig erstmal mit einem Button-Press

let mapWidth = currentLevel.levelData.width
let mapHeight = currentLevel.levelData.height

let MAP = { tw: mapWidth, th: mapHeight } // ! Diese sollte ich auch aus der level.js errechnen. Achtung! Wenn ich Maps in anderen Dimensionen lade, dann ändert sich auch das Scaling (Das wirkt sich auch aufs HUD aus)! Entweder ich mache eine Scaling-Variable, die zur Map gehört, oder ich erstelle nur Maps in einer Bestimmten Größe.
let TILE = 32
let METER = TILE
let GRAVITY = 9.8 * 6, // default (exagerated) gravity
  MAXDX = 15, // default max horizontal speed (15 tiles per second)
  MAXDY = 60, // default max vertical speed   (60 tiles per second)
  ACCEL = 1 / 2, // default take 1/2 second to reach maxdx (horizontal acceleration)
  FRICTION = 1 / 6, // default take 1/6 second to stop from maxdx (horizontal friction)
  IMPULSE = 1500, // default player jump impulse
  COLOR = {
    BLACK: '#000000',
    YELLOW: '#ECD078',
    BRICK: '#D95B43',
    PINK: '#C02942',
    PURPLE: '#542437',
    GREY: '#333',
    SLATE: '#53777A',
    GOLD: 'gold',
  },
  COLORS = [COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY],
  KEY = {
    SPACE: 'Space',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    PAUSE: 'KeyP',
    ENTER: 'Enter',
    X: 'KeyX',
    Y: 'KeyY',
    L: 'KeyL',
  }

let fps = 60,
  step = 1 / fps,
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  player = {},
  monsters = [],
  treasure = [],
  doors = [], // ! Hier sammel ich alle Door Objekte.
  cells = [], // ! vielleicht kann ich hieraus aber auch einfach ein Objekt machen, das Arrays für collCells, bgCells und fgCells beinhaltet
  // cells = {
  // collCells: [],
  // bgCells: [],
  // fgCells: [],
  // }
  bgCells = [], // ! Die sind für die background cells.
  fgCells = [], // ! Die sind für die foreground cells.
  paused = false,
  showDevInfo = false

canvas.width = mapWidth * TILE
canvas.height = mapHeight * TILE

let width = (canvas.width = mapWidth * TILE) // * Das ist clever, weil ich so der Canvas immer von der Map Size abhängig ist. Zusammen mit ctx.scale und ctx.translate bekomme ich so auch eine Camera hin!
let height = (canvas.height = mapHeight * TILE)

let scalingFactor = currentLevel.scalingFactor // * 8 fühlt sich ungefähr nach 8bit Grafik an.

let scaledCanvas = {
  width: canvas.width / scalingFactor,
  height: canvas.height / scalingFactor,
}

let t2p = function (t) {
    return t * TILE
  },
  p2t = function (p) {
    return Math.floor(p / TILE)
  },
  cell = function (x, y) {
    return tcell(p2t(x), p2t(y), mapWidth)
  },
  tcell = function (tx, ty, mapWidth) { // ! Hier brauche ich entweder eine allgemeinere Funktion oder noch weiter für bgCells ud fgCells.
    return cells[tx + ty * mapWidth]
  }

// * Init Level Funtion
function _initLevel(newLevel) {
  console.log('log collected 2! ', newLevel)
  monsters = []
  treasure = []
  cells = []
  currentLevel = newLevel
  player.collected = 0

  mapWidth = currentLevel.levelData.width
  mapHeight = currentLevel.levelData.height

  canvas.width = mapWidth * TILE
  canvas.height = mapHeight * TILE

  scalingFactor = currentLevel.scalingFactor

  scaledCanvas = {
    width: canvas.width / scalingFactor,
    height: canvas.height / scalingFactor,
  }

  setup(newLevel.levelData)
}

// * Const Sfx from audio files //
// ! Achtung: utils müssen in index.html vor den variables geladen werden.

let sfxVolume = 0.2
let musicVolume = 0.5

let sfx = {
  jump: new sound('./audio/Jump.wav', sfxVolume),
  pickup: new sound('./audio/Pickup_Coin.wav', sfxVolume),
  die: new sound('./audio/Explosion.wav', sfxVolume),
  takeDamage: new sound('./audio/Randomize3.wav', sfxVolume),
  killMonster: new sound('./audio/Randomize.wav', sfxVolume),
  powerup: new sound('./audio/Powerup.wav', sfxVolume),
}

let theme = {
  level1: new music('./audio/music/8BitCave.wav', musicVolume),
}

let globalPlayer = {
  collected: 0,
  killed: 0,
  maxHitpoints: 6,
  currentHitpoints: 3,
  vul: true,
  hurt: false,
  sprites: {
    idle: {
      tiles: [5],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
    run: {
      tiles: [0, 1, 2, 1],
      framerate: 5,
      framebuffer: 10,
      loop: true,
      currentFrame: 0,
    },
    jump: {
      tiles: [4],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
  },
}
