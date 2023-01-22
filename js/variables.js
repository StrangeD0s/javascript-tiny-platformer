//-------------------------------------------------------------------------
// GAME CONSTANTS AND letIABLES
//-------------------------------------------------------------------------

let MAP = { tw: 64, th: 48 },
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

const scaledCanvas = {
  width: canvas.width / 2,
  height: canvas.height / 2,
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
let sfx = {
  jump: new sound('./audio/Jump.wav'),
  pickup: new sound('./audio/Pickup_Coin.wav'),
  die: new sound('./audio/Randomize3.wav'),
  killMonster: new sound('./audio/Randomize.wav'),
  powerup: new sound('./audio/Powerup.wav'),
}
