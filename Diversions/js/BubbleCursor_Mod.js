/*!
 * BubbleCursor_Mod.js
 * - a mod on the 90's cursors collection
 * -- https://github.com/tholman/90s-cursor-effects
 * -- http://codepen.io/tholman/full/qbxxxq/
 */

(function bubblesCursor() {
  // get viewport dimensions
  //var width = window.innerWidth;
  //var height = window.innerHeight;
  var width = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
  var height = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
  var cursor = {x: width, y: height};
  var particles = [];
  
  function init() {
    bindEvents();
    loop();
  }
  // Bind events that are needed
  function bindEvents() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchstart', onTouchMove);
    window.addEventListener('resize', onWindowResize);
  }
  // update the window size
  function onWindowResize(e) {
  width = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
  height = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
  }
  // on a touch
  function onTouchMove(e) { // this needs to be updated same as rodent below
    if( e.touches.length > 0 ) {
      for( var i = 0; i < e.touches.length; i++ ) {
        addParticle(e.touches[i].clientX, e.touches[i].clientY);
      }
    }
  }
  // or a mouse motion  
  function onMouseMove(e) {    
    //cursor.x = e.clientX;
    //cursor.y = e.clientY;
	// burp a bubble every time cursor is moved 1% or more of width or height
	if ((Math.abs(cursor.x - e.clientX) > (width * .015)) || (Math.abs(cursor.y - e.clientY) > (width * .015))) {
		cursor.y = e.clientY;
		cursor.x = e.clientX;
		addParticle( cursor.x, cursor.y);
	}
  }
  
  function addParticle(x, y) {
    var particle = new Particle();
    particle.init(x, y);
    particles.push(particle);
  }
  
   // Update particles array
  function updateParticles() {
    for( var i = 0; i < particles.length; i++ ) {
      particles[i].update();
    }
   // Remove dead particles
    for( var i = particles.length -1; i >= 0; i-- ) {
      if( particles[i].lifeSpan < 0 ) {
        particles[i].die();
        particles.splice(i, 1);
      }
    }
  }
  
  function loop() {
    requestAnimationFrame(loop);
    updateParticles();
  }
  
  /**
   * Particles
   */
  function Particle() {
    this.lifeSpan = 350; //ms
    this.initialStyles ={
      "position": "fixed",
      "display": "block",
	  "top": "0",
      "pointerEvents": "none",
      "z-index": "10000000",
      "width": ".6vw",
      "height": ".6vw",
      "background": "#80d0d0", // pale blue bubbles color scheme
      "box-shadow": "inset .2vw .3vw #80ffff, -.2vw 0px #5b9dc3, 0px -.1vw #4b8db3, .1vw 0px #3a82b5, 0px .2vw #3a92c5",
      "border-radius": "2vw",
      "will-change": "transform"
    };

    // Init, and set properties
    this.init = function(x, y) {
      this.velocity = {
        x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 10),
        y: (-.4 + (Math.random() * -1))
      };
      this.position = {x: x, y: y};
// console.info("offset "+window.pageYOffset);
      this.element = document.createElement('span');
      applyProperties(this.element, this.initialStyles);
      this.update();
      
      document.body.appendChild(this.element);
//          document.querySelector('.container').appendChild(this.element);
	}
    this.update = function() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      // Update velocities
      this.velocity.x += (Math.random() < 0.5 ? -1 : 1) * 2 / 75;
      this.velocity.y -= Math.random() / 500;
      this.lifeSpan--;
      
// console.info("thisY "+this.position.y); // scale the bubbles by their lifetime age
      this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + ( 1 + (350 - this.lifeSpan) / 250) + ")";
    }
    this.die = function() {
      this.element.parentNode.removeChild(this.element);
    }
  }
  
  /**
   * Utils
   */
  
  // Applies css `properties` to an element.
  function applyProperties( target, properties ) {
    for( var key in properties ) {
      target.style[ key ] = properties[ key ];
    }
  }
  
  init();
})()
