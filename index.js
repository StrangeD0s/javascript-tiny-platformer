function main() {
  //-------------------------------------------------------------------------
  // THE GAME LOOP
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
      update(step)
    }
    render(ctx, counter, dt)
    last = now
    counter++
    fpsmeter.tick()
    requestAnimationFrame(frame, canvas)
  }

  // ! keycode ist deprecated. Input muss ich sowieso umbauen.
  document.addEventListener(
    'keydown',
    function (ev) {
      return onkey(ev, ev.keyCode, true)
    },
    false
  )
  document.addEventListener(
    'keyup',
    function (ev) {
      return onkey(ev, ev.keyCode, false)
    },
    false
  )

  setup(level)
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
