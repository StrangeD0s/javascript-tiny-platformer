//-------------------------------------------------------------------------
// UTILITIES
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
function sound(src) {
  this.sound = document.createElement('audio')
  this.sound.src = src
  this.sound.setAttribute('preload', 'auto')
  this.sound.setAttribute('controls', 'none')
  this.sound.style.display = 'none'
  document.body.appendChild(this.sound)
  this.sound.volume = 0.05
  this.play = function () {
    this.sound.play()
  }
  this.stop = function () {
    this.sound.pause()
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

// * Renderfunktion für DevInfos
function renderDevInfos() {
  if (showDevInfo) {
    const lineHeight = 50

    const isPaused = paused

    const devObject = {
      player_accel: player.accel,
      player_collected: player.collected,
      player_ddx: player.ddx,
      player_ddy: player.ddy,
      player_dx: player.dx,
      player_dy: player.dy,
      player_falling: player.falling,
      player_friction: player.friction,
      player_gravity: player.gravity,
      player_impulse: player.impulse,
      player_jumping: player.jumping,
      player_killed: player.killed,
      player_left: player.left,
      player_maxdx: player.maxdx,
      player_maxdy: player.maxdy,
      player_monster: player.monster,
      player_player: player.player,
      player_right: player.right,
      player_start: player.start,
      player_treasure: player.treasure,
      player_x: player.x,
      player_y: player.y,
      canvas_width: canvas.height,
      cameraWithBox_x: cameraWithBox.position.x,
    }

    const canvas_width = canvas.width
    const canvas_height = canvas.height

    function text() {
      ctx.fillStyle = 'hotpink'
      for (const [index, [key, value]] of Object.entries(
        Object.entries(devObject)
      )) {
        const newIndex = Number(index) + 1
        const newValue = typeof value === 'number' ? value.toFixed(2) : value
        ctx.fillText(`${key}: ${newValue}`, 50, lineHeight * newIndex)
      }
    }

    ctx.font = '40px Arial'
    ctx.fillStyle = 'hotpink'
    ctx.textAlign = 'left'

    /* ctx.fillText('camerabox_x: ' + camerabox_x.toFixed(2), 50, lineHeight * 6)
    ctx.fillText('camerabox_y: ' + camerabox_y.toFixed(2), 50, lineHeight * 7)

    ctx.fillText('camerabox_width: ' + camerabox_width, 50, lineHeight * 8)
    ctx.fillText('camerabox_height: ' + camerabox_height, 50, lineHeight * 9)
    ctx.fillText('canvas_width: ' + canvas_width / 4, 50, lineHeight * 10)
    ctx.fillText('canvas_height: ' + canvas_height / 4, 50, lineHeight * 11) */
    ctx.fillStyle = 'papayawhip'
    text()
  }
}
