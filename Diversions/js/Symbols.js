/*!
 * Symbols.js
 * modified from Fairy Dust Cursor.js
 * - 90's cursors collection
 * -- https://github.com/tholman/90s-cursor-effects
 * -- https://codepen.io/tholman/full/jWmZxZ/
 * -- mod has rain of various symbols in colors
 */

(function symbolsCursor() {
  
//  var possibleColors = ["#D61C59", "#d00000", "#E7D84B", "#00d000", "#1B8798", "#0000d0"]
  var possibleColors = ["#ff0000", "#ff8000", "#ffff00", "#80ff00", "#00ff00", "#00ff80","#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"];
  var possibleChars = ["@", "*", "&empty;", "&cent;", "&sect;", "&plusmn;","&micro;", "&infin;", "&oplus;", "&otimes;", "&Delta;", "&Omega;"];
  //var width = window.innerWidth;
  //var height = window.innerHeight;
  var width = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
  var height = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
  var cursor = {x: width/2, y: height/2};
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
  
  function onTouchMove(e) {
    if( e.touches.length > 0 ) {
      for( var i = 0; i < e.touches.length; i++ ) {
        addParticle( e.touches[i].clientX, e.touches[i].clientY, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
      }
    }
  }
  
  function onMouseMove(e) {    
    // cursor.x = e.clientX;
    // cursor.y = e.clientY;
    
	if ((Math.abs(cursor.x - e.clientX) > (width * .01)) || (Math.abs(cursor.y - e.clientY) > (width * .01))) {
		cursor.y = e.clientY;
		cursor.x = e.clientX;
    addParticle( cursor.x, cursor.y, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
   }
  }
  
  function addParticle(x, y, color) {
    var particle = new Particle();
    particle.init(x, y, color);
    particles.push(particle);
  }
  
  function updateParticles() {
    
    // Updated
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

	this.character = possibleChars[Math.floor(Math.random()*possibleChars.length)];
//	this.character = "&plusmn;";
    this.lifeSpan = 350; //ms
    this.initialStyles ={
      "position": "fixed",
	  "top": "0",
      "display": "block",
      "pointerEvents": "none",
      "z-index": "10000000",
      "fontSize": "1.5vw",
      "will-change": "transform"
    };

    // Init, and set properties
    this.init = function(x, y, color) {

      this.velocity = {
        x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 10),
        y: 1
      };
      
      this.position = {x: x, y: y};
      this.position = {x: x - 10, y: y - 10};
      this.initialStyles.color = color;

      this.element = document.createElement('span');
      this.element.innerHTML = this.character;
      applyProperties(this.element, this.initialStyles);
      this.update();
      
      document.body.appendChild(this.element);
    };
    
    this.update = function() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      // Update velocities
      this.velocity.x += (Math.random() < 0.5 ? -1 : 1) * 2 / 75;
      this.velocity.y -= Math.random() / 500;
      this.lifeSpan--;
      
      this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px, 0) scale(" + (this.lifeSpan / 120) + ")";
//      this.element.style.transform = "transform(" + this.position.x + "px," + this.position.y + "px) scale(" + (this.lifeSpan / 120) + ")";
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
})();
