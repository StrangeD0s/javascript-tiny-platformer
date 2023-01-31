function main() {
  //-------------------------------------------------------------------------
  // 6. THE GAME LOOP
  //-------------------------------------------------------------------------

  var counter = 0,
    dt = 0,
    now,
    last = timestamp(),
    fpsmeter = new FPSMeter({
      decimals: 0,
      graph: true,
      theme: 'dark',
      left: '5px',
    })

  function frame() {
    fpsmeter.tickStart()
    now = timestamp()
    dt = dt + Math.min(1, (now - last) / 1000)
    while (dt > step) {
      dt = dt - step

      // * Update wird pausiert bei Toggle 'p'.
      if (!paused) {
        update(step)
      }
    }

    render(ctx, counter, dt, currentLevel)
    last = now
    counter++
    fpsmeter.tick()
    requestAnimationFrame(frame, canvas)
  }

  document.addEventListener(
    'keydown',
    function (ev) {
      return onkey(ev, ev.code, true)
    },
    false
  )
  document.addEventListener(
    'keyup',
    function (ev) {
      return onkey(ev, ev.code, false)
    },
    false
  )

  // * EventListener für Pause-Taste
  window.addEventListener('keydown', function (e) {
    var key = e.code
    if (key === 'KeyP') {
      // p key
      togglePause()
    }
  })
  // * EventListener für DevInfos Toggle
  window.addEventListener('keydown', function (e) {
    var key = e.code
    if (key === 'KeyO') {
      // p key
      toggleDevInfos()
    }
  })

  setup(currentLevel.levelData) // ! Was brauche ich hier, damit das variabel alle Level laden kann?
  frame()
}

// * window onload function
;(function () {
  //-------------------------------------------------------------------------
  // POLYFILLS
  //-------------------------------------------------------------------------

  if (!window.requestAnimationFrame) {
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback, element) {
        window.setTimeout(callback, 1000 / 60)
      }
  }

  main()
})()
