//-------------------------------------------------------------------------
// GAME CONSTANTS AND letIABLES
//-------------------------------------------------------------------------

// * Import tiles and level map //

const tileAtlas = new Image()
tileAtlas.src = './img/monochrome_tilemap_packed.png'

const tileAtlas2 = new Image()
tileAtlas2.src = './img/tiles.png'

let tileSize = 16
let tileOutputSize = 2 // can set to 1 for 32px or higher

const level1Atlas = {
  mapsize: { tw: 64, th: 48 },
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
  mapsize: { tw: 30, th: 20 },
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

// * end of Import tiles and level map //

let MAP = { tw: 64, th: 48 }, // ! Diese sollte ich auch aus der level.js errechnen. Achtung! Wenn ich Maps in anderen Dimensionen lade, dann ändert sich auch das Scaling (Das wirkt sich auch aufs HUD aus)! Entweder ich mache eine Scaling-Variable, die zur Map gehört, oder ich erstelle nur Maps in einer Bestimmten Größe.
  TILE = 32,
  METER = TILE,
  GRAVITY = 9.8 * 6, // default (exagerated) gravity
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
  }

let fps = 60,
  step = 1 / fps,
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  width = (canvas.width = MAP.tw * TILE), // * Das ist clever, weil ich so der Canvas immer von der Map Size abhängig ist. Zusammen mit ctx.scale und ctx.translate bekomme ich so auch eine Camera hin!
  height = (canvas.height = MAP.th * TILE),
  player = {},
  monsters = [],
  treasure = [],
  cells = [],
  paused = false,
  showDevInfo = false

const scalingFactor = 8 // * 8 fühlt sich ungefähr nach 8bit Grafik an.

const scaledCanvas = {
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
    return tcell(p2t(x), p2t(y))
  },
  tcell = function (tx, ty) {
    return cells[tx + ty * MAP.tw]
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

let bounderMonster = {
  sprites: {
    idle: {
      tiles: [3],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
    run: {
      tiles: [4, 5, 6],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
  },
}

let slimeMonster = {
  sprites: {
    idle: {
      tiles: [0],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
    run: {
      tiles: [0, 1, 2],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
  },
}
