let playerObject = {
  maxHitpoints: 5,
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
    shoot: {
      tiles: [3],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
  },
}

let bounderMonster = {
  class: 'monster',
  currentHitpoints: 2,
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
  class: 'monster',
  currentHitpoints: 1,
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

let coinTreasure = {
  sprites: {
    idle: {
      tiles: [4, 5, 6, 7],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
  },
}

let simpleBullet = {
  sprites: {
    idle: {
      tiles: [8, 9, 10],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
  },
}

let ammo = {
  sprites: {
    idle: {
      tiles: [11],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
  },
}

let extralife = {
  sprites: {
    idle: {
      tiles: [13],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
  },
}

let health = {
  sprites: {
    idle: {
      tiles: [0, 1, 2],
      framerate: 5,
      framebuffer: 8,
      loop: true,
      currentFrame: 0,
    },
  },
}
