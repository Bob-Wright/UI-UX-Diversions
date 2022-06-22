import createjs from 'createjs'

function Ship() {
  this.Container_constructor();

  this.shipFlame = new createjs.Shape();
  this.shipBody = new createjs.Shape();

  this.addChild(this.shipFlame);
  this.addChild(this.shipBody);

  this.makeShape();
  this.timeout = 0;
  this.thrust = 0;
  this.vX = 0;
  this.vY = 0;
}
var p = createjs.extend(Ship, createjs.Container);

// public properties:
Ship.TOGGLE = 60;
Ship.MAX_THRUST = 2;
Ship.MAX_VELOCITY = 5;

// public properties:
p.shipFlame;
p.shipBody;

p.timeout;
p.thrust;

p.vX;
p.vY;

p.bounds;
p.hit;


// public methods:
p.makeShape = function () {
  //draw ship body
  var g = this.shipBody.graphics;
  g.clear();
  g.beginStroke('#FFFFFF');
  g.beginFill('#FFFFFF')

  g.moveTo(0.0 - 6.5, 4.3);
  g.bezierCurveTo(0.0 - 6.5, 4.0, 0.0 - 6.5, 3.8, 0.0 - 6.5, 3.6);
  g.bezierCurveTo(0.1 - 6.5, 3.3, 0.1 - 6.5, 3.1, 0.2 - 6.5, 2.9);
  g.bezierCurveTo(0.5 - 6.5, 1.9, 0.9 - 6.5, 1.0, 1.2 - 6.5, 0.0);
  g.bezierCurveTo(1.3 - 6.5, 0.0, 1.5 - 6.5, 0.0, 1.6 - 6.5, 0.0);
  g.bezierCurveTo(2.0 - 6.5, 0.4, 2.3 - 6.5, 0.9, 2.7 - 6.5, 1.3);
  g.bezierCurveTo(3.1 - 6.5, 1.7, 3.5 - 6.5, 1.8, 4.0 - 6.5, 1.8);
  g.bezierCurveTo(5.7 - 6.5, 1.8, 7.3 - 6.5, 1.8, 9.0 - 6.5, 1.8);
  g.bezierCurveTo(9.5 - 6.5, 1.8, 9.9 - 6.5, 1.7, 10.3 - 6.5, 1.3);
  g.bezierCurveTo(10.7 - 6.5, 0.9, 11.0 - 6.5, 0.4, 11.4 - 6.5, 0.0);
  g.bezierCurveTo(11.5 - 6.5, 0.0, 11.7 - 6.5, 0.0, 11.8 - 6.5, 0.0);
  g.bezierCurveTo(12.1 - 6.5, 0.9, 12.5 - 6.5, 1.8, 12.8 - 6.5, 2.8);
  g.bezierCurveTo(12.9 - 6.5, 3.2, 12.9 - 6.5, 3.7, 12.9 - 6.5, 4.2);
  g.bezierCurveTo(12.9 - 6.5, 4.5, 12.7 - 6.5, 4.8, 12.4 - 6.5, 5.0);
  g.bezierCurveTo(11.8 - 6.5, 5.6, 11.1 - 6.5, 6.2, 10.5 - 6.5, 6.8);
  g.bezierCurveTo(10.2 - 6.5, 7.1, 10.1 - 6.5, 7.6, 10.0 - 6.5, 8.0);

  g.bezierCurveTo(9.8 - 6.5, 9.0, 9.6 - 6.5, 10.0, 9.3 - 6.5, 11.0);
  g.bezierCurveTo(8.8 - 6.5, 12.7, 8.4 - 6.5, 14.4, 7.1 - 6.5, 15.7);
  g.bezierCurveTo(6.9 - 6.5, 15.9, 6.7 - 6.5, 16.0, 6.4 - 6.5, 16.0);
  g.bezierCurveTo(6.2 - 6.5, 16.0, 6.0 - 6.5, 15.9, 5.8 - 6.5, 15.7);
  g.bezierCurveTo(5.1 - 6.5, 15.0, 4.7 - 6.5, 14.2, 4.4 - 6.5, 13.3);
  g.bezierCurveTo(3.7 - 6.5, 11.5, 3.2 - 6.5, 9.7, 2.9 - 6.5, 7.8);
  g.bezierCurveTo(2.9 - 6.5, 7.6, 2.9 - 6.5, 7.3, 2.7 - 6.5, 7.1);
  g.bezierCurveTo(2.1 - 6.5, 6.5, 1.5 - 6.5, 5.8, 0.8 - 6.5, 5.2);
  g.bezierCurveTo(0.5 - 6.5, 4.9, 0.2 - 6.5, 4.7, 0.0 - 6.5, 4.3);
  g.closePath()

  g.moveTo(5.2 - 6.5, 10.3);
  g.bezierCurveTo(5.1 - 6.5, 11.1, 5.7 - 6.5, 11.6, 6.5 - 6.5, 11.6);
  g.bezierCurveTo(7.3 - 6.5, 11.7, 7.8 - 6.5, 11.1, 7.8 - 6.5, 10.3);
  g.bezierCurveTo(7.9 - 6.5, 9.5, 7.3 - 6.5, 9.0, 6.5 - 6.5, 9.0);
  g.bezierCurveTo(5.7 - 6.5, 8.9, 5.2 - 6.5, 9.5, 5.2 - 6.5, 10.3);
  g.closePath();


  //draw ship flame
  var o = this.shipFlame;
  o.scale = 0.5;
  o.y = -5;

  g = o.graphics;
  g.clear();
  g.beginStroke('#FFFFFF');
  g.beginFill('#ff1742');

  g.moveTo(2, 0 + 2);		//ship
  g.lineTo(4, -3 + 2);	//rpoint
  g.lineTo(2, -2 + 2);	//rnotch
  g.lineTo(0, -5 + 2);	//tip
  g.lineTo(-2, -2 + 2);	//lnotch
  g.lineTo(-4, -3 + 2);	//lpoint
  g.lineTo(-2, -0 + 2);	//ship

  //furthest visual element
  this.bounds = 10;
  this.hit = this.bounds;
}

p.tick = function (event) {
  //move by velocity
  this.x += this.vX;
  this.y += this.vY;

  //with thrust flicker a flame every Ship.TOGGLE frames, attenuate thrust
  if (this.thrust > 0) {
    this.timeout++;
    this.shipFlame.alpha = 1;

    if (this.timeout > Ship.TOGGLE) {
      this.timeout = 0;
      if (this.shipFlame.scaleX == 1) {
        this.shipFlame.scale = 0.5;
      } else {
        this.shipFlame.scale = 1;
      }
    }
    this.thrust -= 0.5;
  } else {
    this.shipFlame.alpha = 0;
    this.thrust = 0;
  }
}

p.accelerate = function () {
  //increase push ammount for acceleration
  this.thrust += this.thrust + 0.6;
  if (this.thrust >= Ship.MAX_THRUST) {
    this.thrust = Ship.MAX_THRUST;
  }

  //accelerate
  this.vX += Math.sin(this.rotation * (Math.PI / -180)) * this.thrust;
  this.vY += Math.cos(this.rotation * (Math.PI / -180)) * this.thrust;

  //cap max speeds
  this.vX = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.vX));
  this.vY = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.vY));
}

export default createjs.promote(Ship, 'Container')

