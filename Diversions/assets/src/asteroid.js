import createjs from 'createjs'

function Astroid(size) {
  this.Shape_constructor()
  this.activate(size)
}

let p = createjs.extend(Astroid, createjs.Shape)


p.bounds
p.hit
p.size
p.spin
p.vX
p.vY
p.active

p.getShape = function(size) {
  let angle = 0
  let radius = size

  this.size = size
  this.hit = size
  this.bounds = 0

  this.graphics.clear()
  this.graphics.beginStroke('#FFFFFF')
  this.graphics.moveTo(0, size)

  while (angle < (Math.PI * 2 - .5)) {
    angle += .25 + (Math.random() * 100) / 500
    radius = size + (size / 2 * Math.random())
    this.graphics.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius)

    if (radius > this.bounds) {
      this.bounds = radius
    }
    this.hit = (this.hit + radius) / 2
  }

  this.graphics.closePath()
  this.hit *= 1.1

}

p.activate = function(size) {
  this.getShape(size)

  let angle = Math.random() * (Math.PI * 2)
  this.vX = Math.sin(angle) * (5 - size / 15)
  this.vY = Math.cos(angle) * (5 - size / 15)
  this.spin = (Math.random() + 0.2 ) * this.vX
  this.active = true
}

p.tick = function(event) {
  this.rotation += this.spin
  this.x += this.vX
  this.y += this.vY
}

p.floatOnScreen = function(width, height) {
  if (Math.random() * (width + height) > width) {
    if (this.vX > 0) {
      this.x = -2 * this.bounds
    } else {
      this.x = 2 * this.bounds + width
    }
    if (this.vY > 0) {
      this.y = Math.random() * height * 0.5
    } else {
      this.y = Math.random() * height * 0.5 + 0.5 * height
    }
  } else {
    if (this.vY > 0) {
      this.y = -2 * this.bounds
    } else {
      this.y = 2 * this.bounds + height
    }
    if (this.vX > 0) {
      this.x = Math.random() * width * 0.5
    } else {
      this.x = Math.random() * width * 0.5 + 0.5 * width
    }
  }
}

p.hitPoint = function (tX, tY) {
  return this.hitRadius(tX, tY, 0)
}

p.hitRadius = function (tX, tY, tHit) {
  if (tX - tHit > this.x + this.hit) {
    return
  }
  if (tX + tHit < this.x - this.hit) {
    return
  }

  if (tY - tHit > this.y + this.hit) {
    return
  }

  if (tY + tHit < this.y - this.hit) {
    return
  }

  //now do the circle distance test
  return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.x - tX), 2) + Math.pow(Math.abs(this.y - tY), 2));
}



export default createjs.promote(Astroid, 'Shape')
