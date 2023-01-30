//-------------------------------------------------------------------------
// 1. UTILITIES
//-------------------------------------------------------------------------

function timestamp() {
  return window.performance && window.performance.now
    ? window.performance.now()
    : new Date().getTime()
}

function bound(x, min, max) {
  return Math.max(min, Math.min(max, x))
}

/* function get(url, onsuccess) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) onsuccess(request);
    };
    request.open("GET", url, true);
    request.send();
  } */

function overlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(
    x1 + w1 - 1 < x2 ||
    x2 + w2 - 1 < x1 ||
    y1 + h1 - 1 < y2 ||
    y2 + h2 - 1 < y1
  )
}

// * SFX function
function sound(src, volume) {
  this.sound = document.createElement('audio')
  this.sound.src = src
  this.sound.setAttribute('preload', 'auto')
  this.sound.setAttribute('controls', 'none')
  this.sound.style.display = 'none'
  document.body.appendChild(this.sound)
  this.sound.volume = volume
  this.play = function () {
    this.sound.play()
  }
  this.stop = function () {
    this.sound.pause()
  }
}

// * Music function
function music(src, volume) {
  this.music = document.createElement('audio')
  this.music.src = src
  this.music.setAttribute('preload', 'auto')
  this.music.setAttribute('controls', 'none')
  this.music.setAttribute('loop', 'loop')
  this.music.style.display = 'none'
  document.body.appendChild(this.music)
  this.music.volume = volume
  this.play = function () {
    this.music.play()
  }
  this.stop = function () {
    this.music.pause()
  }
}

// * Pause function
function togglePause() {
  console.log('log togglePause', paused)
  if (!paused) {
    paused = true
  } else if (paused) {
    paused = false
  }
}

function toggleDevInfos() {
  if (!showDevInfo) {
    showDevInfo = true
  } else if (showDevInfo) {
    showDevInfo = false
  }
}

function renderHudSprites() {
  const hudObject = {
    player_hitpoints: player.currentHitpoints,
    player_collected: player.collected,
  }

  function hitpoints() {
    ctx.save()
    ctx.scale(scalingFactor / 4, scalingFactor / 4)
    ctx.textAlign = 'left'
    ctx.font = '40px Arial'

    ctx.fillStyle = 'white'
    ctx.fillText(`health: ${hudObject.player_hitpoints}`, 50, 50)
    ctx.restore()
  }
  hitpoints()
}

// * Renderfunktion für DevInfos
function renderDevInfos() {
  if (showDevInfo) {
    const backgroundColor = 'rgba(18, 64, 90, 0.85)'
    const color = 'white'
    const lineHeight = 50

    const devObject = {
      player_accel: player.accel,
      player_ddx: player.ddx,
      player_ddy: player.ddy,
      player_dx: player.dx,
      player_dy: player.dy,
      player_falling: player.falling,
      player_friction: player.friction,
      player_gravity: player.gravity,
      player_impulse: player.impulse,
      player_jumping: player.jumping,
      player_left: player.left,
      player_maxdx: player.maxdx,
      player_maxdy: player.maxdy,
      player_right: player.right,
      player_x: player.x,
      player_y: player.y,
      player_vul: player.vul,
      player_hurt: player.hurt,
      player_flipped: player.flipped,
      canvas_width: canvas.height,
      cameraWithBox_x: cameraWithBox.position.x,
    }

    const canvas_width = canvas.width
    const canvas_height = canvas.height

    function text() {
      ctx.textAlign = 'left'
      ctx.font = '40px Arial'
      for (const [index, [key, value]] of Object.entries(
        Object.entries(devObject)
      )) {
        const newIndex = Number(index) + 1
        const newValue = typeof value === 'number' ? value.toFixed(2) : value
        ctx.fillStyle = backgroundColor
        ctx.fillRect(40, lineHeight * newIndex - 40, 500, lineHeight)
        ctx.fillStyle = color
        ctx.fillText(`${key}: ${newValue}`, 50, lineHeight * newIndex)
      }
    }

    text()
  }
}
