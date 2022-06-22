import MobileDetect from 'mobile-detect'
import createjs from 'createjs'
import SpaceRock from './rocks'
import Ship from './ship'
import Astroid from './astroid'

import './style.scss'

const clientDevice = new MobileDetect(window.navigator.userAgent)
const NOT_SUPPORTED = !!clientDevice.mobile() || !!clientDevice.tablet()


var DIFFICULTY = 3;			//how fast the game gets more difficult
var ROCK_TIME = 110;		//aprox tick count until a new asteroid gets introduced
var SUB_ROCK_COUNT = 4;		//how many small rocks to make on rock death

var TURN_FACTOR = 14;		//how far the ship turns per frame

var KEYCODE_SPACE = 32;		//useful keycode
var KEYCODE_UP = 38;		//useful keycode
var KEYCODE_LEFT = 37;		//useful keycode
var KEYCODE_RIGHT = 39;		//useful keycode
var KEYCODE_W = 87;			//useful keycode
var KEYCODE_A = 65;			//useful keycode
var KEYCODE_D = 68;			//useful keycode

var shootHeld;			//is the user holding a shoot command
var lfHeld;				//is the user holding a turn left command
var rtHeld;				//is the user holding a turn right command
var fwdHeld;			//is the user holding a forward command
var dnHeld

var timeToRock;			//difficulty adjusted version of ROCK_TIME
var nextRock = 0;			//ticks left until a new space rock arrives

var rockBelt;			//space rock array
var astroidSet;

var canvas;			//Main canvas
var stage;			//Main display stage

var ship;			//the actual ship
var alive;			//wheter the player is alive

var titleField
var hintField
var messageField;		//Message display field
var scoreField;			//score Field

var loadingInterval = 0;

var startTime;
var currentTime;

var hasStarted = false

var astroidCount = 0

if(!NOT_SUPPORTED) {
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
}

window.addEventListener('resize', resizeCanvas, false);

canvas = document.getElementById('app');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const starsCount = 150
function generateStars() {
  let wrapper = document.querySelector('.starsWrapper')
  for(let i = 0; i < starsCount; i++) {
    let star = document.createElement('div')
    star.className = `stars stars-${i}`
    wrapper.appendChild(star)
  }
}

function init() {
  resizeCanvas()
  generateStars()
  displayMessages()
  doneLoading()
}

function displayMessages() {
  stage = new createjs.Stage(canvas);
  titleField = new createjs.Text('404', '55px Oxygen Mono', '#eeeeee')
  messageField = new createjs.Text('Seems like you\'re lost in space...', '16px Oxygen Mono', '#fff')

  if(!NOT_SUPPORTED) {
    hintField = new createjs.Text('Use arrow keys to move', '14px Oxygen Mono', '#ddd')
    hintField.x = canvas.width / 2
    hintField.y = canvas.height / 1.8
    hintField.textAlign = 'center';
  }

  titleField.x = canvas.width / 2;
  titleField.y = canvas.height / 6;
  titleField.textAlign = 'center';

  messageField.maxWidth = 1000;
  messageField.textAlign = 'center';
  messageField.textBaseline = 'middle';
  messageField.x = canvas.width / 2;
  messageField.y = canvas.height / (NOT_SUPPORTED ? 3 : 3.4);

  stage.addChild(hintField)
  stage.addChild(titleField)
  stage.addChild(messageField);
  stage.update(); 	//update the stage to show text
}

function doneLoading(event) {
  clearInterval(loadingInterval);
  scoreField = new createjs.Text('', 'bold 18px Arial', '#FFFFFF');
  scoreField.textAlign = 'right';
  scoreField.x = canvas.width - 20;
  scoreField.y = 20;
  scoreField.maxWidth = 1000;
  hasStarted = false
  astroidCount = NOT_SUPPORTED ? 1 : 3

  restart()
  watchRestart();
}

function watchRestart() {
  //watch for clicks
  stage.addChild(messageField);
  stage.addChild(hintField)
  stage.addChild(titleField)
  stage.update(); 	//update the stage to show text
}

//reset all game logic
function restart() {

  // dont allow to restart will alive
  if(alive) {
    return
  }

  startTime = (new Date()).getTime();

  //hide anything on stage and show the score
  stage.removeAllChildren();
  scoreField.text = hasStarted ? '0' : ''
  stage.addChild(scoreField);

  //new arrays to dump old data
  rockBelt = [];
  astroidSet = getAstroidSet(astroidCount);

  //create the player
  alive = true;
  ship = new Ship();
  ship.x = canvas.width / 2;
  ship.y = canvas.height / 2;
  ship.rotation = 180

  //log time untill values
  timeToRock = ROCK_TIME;

  //reset key presses
  shootHeld = lfHeld = rtHeld = fwdHeld = dnHeld = false;

  //ensure stage is blank and add the ship
  stage.clear();

  if(!NOT_SUPPORTED) {
    stage.addChild(ship);
  }

  //init first rock
  var index = getSpaceRock(SpaceRock.LRG_ROCK);
  rockBelt[index].floatOnScreen(canvas.width, canvas.height);

  var index2 = getSpaceRock(SpaceRock.LRG_ROCK);
  rockBelt[index2].floatOnScreen(canvas.width, canvas.height);

  console.log(rockBelt)

  //start game timer
  if (!createjs.Ticker.hasEventListener('tick')) {
    createjs.Ticker.addEventListener('tick', tick);
  }
}

function gameOver() {
  if(hasStarted) {
    alive = false
    currentTime = (new Date()).getTime()
    var time = Math.floor((currentTime-startTime)/1000)

    stage.removeChild(ship)
    messageField.text = `You've survived for ${time} seconds\n\nHit 'Space' to restart`
    titleField.text = ''
    hintField.text = ''
    watchRestart()
  }
}

function startGame() {
  if(!hasStarted) {
    startTime = (new Date()).getTime()
    stage.removeChild(titleField)
    stage.removeChild(messageField)
    stage.removeChild(hintField)
  }
  hasStarted = true
}

function tick(event) {

  // handle score
  if(alive && hasStarted) {
    currentTime = (new Date()).getTime();
    var time = Math.floor((currentTime-startTime)/1000);
    scoreField.text = `Score: ${time}`
  }

  //handle turning
  if (alive && lfHeld) {
    ship.rotation -= TURN_FACTOR;
  } else if (alive && rtHeld) {
    ship.rotation += TURN_FACTOR;
  }

  //handle thrust
  if (alive && fwdHeld) {
    ship.accelerate();
  }


  //handle new spaceRocks
  if (nextRock <= 0) {
    if (alive && hasStarted) {
      timeToRock -= DIFFICULTY;	//reduce spaceRock spacing slowly to increase difficulty with time
      var index = getSpaceRock(SpaceRock.LRG_ROCK);
      rockBelt[index].floatOnScreen(canvas.width, canvas.height);
      nextRock = timeToRock + timeToRock * Math.random();
    }
  } else {
    nextRock--;
  }

  //handle ship looping
  if (alive && outOfBounds(ship, ship.bounds)) {
    placeInBounds(ship, ship.bounds);
  }


  //handle astroid movement
  for (let astroid in astroidSet) {
    let o = astroidSet[astroid]
    if (outOfBounds(o, o.bounds)) {
      placeInBounds(o, o.bounds);
    }
    o.tick(event)
    //handle astroid ship collisions
    if (alive && o.hitRadius(ship.x, ship.y, ship.hit)) {
      gameOver()
    }
  }

  //handle spaceRocks (nested in one loop to prevent excess loops)
  for (let spaceRock in rockBelt) {
    var o = rockBelt[spaceRock];
    if (!o || !o.active) {
      continue;
    }

    //handle spaceRock movement and looping
    if (outOfBounds(o, o.bounds)) {
      placeInBounds(o, o.bounds);
    }
    o.tick(event);

    //handle spaceRock ship collisions
    if (alive && o.hitRadius(ship.x, ship.y, ship.hit)) {
      gameOver()
    }

    //handle spaceRock astroid collisions
    for (let astroid in astroidSet) {
      var p = astroidSet[astroid];
      if (!p || !p.active) {
        continue;
      }

      if (o.hitPoint(p.x, p.y)) {
        var newSize;
        switch (o.size) {
          case SpaceRock.LRG_ROCK:
            newSize = SpaceRock.MED_ROCK;
            break;
          case SpaceRock.MED_ROCK:
            newSize = SpaceRock.SML_ROCK;
            break;
          case SpaceRock.SML_ROCK:
            newSize = 0;
            break;
        }

        //create more
        if (newSize > 0) {
          var i;
          var index;
          var offSet;

          for (i = 0; i < SUB_ROCK_COUNT; i++) {
            index = getSpaceRock(newSize);
            offSet = (Math.random() * o.size * 2) - o.size;
            rockBelt[index].x = o.x + offSet;
            rockBelt[index].y = o.y + offSet;
          }
        }

        //remove
        if(o.size !== SpaceRock.SML_ROCK) {
          stage.removeChild(o);
          rockBelt[spaceRock].active = false;
        }
      }
    }
  }

  //call sub ticks
  ship.tick(event);
  stage.update(event);
}

function outOfBounds(o, bounds) {
  //is it visibly off screen
  return (
    o.x < bounds * -2 ||
    o.y < bounds * -2 ||
    o.x > canvas.width + bounds * 2 ||
    o.y > canvas.height + bounds * 2
  )
}

function placeInBounds(o, bounds) {
  //if its visual bounds are entirely off screen place it off screen on the other side
  if (o.x > canvas.width + bounds * 2) {
    o.x = bounds * -2;
  } else if (o.x < bounds * -2) {
    o.x = canvas.width + bounds * 2;
  }

  //if its visual bounds are entirely off screen place it off screen on the other side
  if (o.y > canvas.height + bounds * 2) {
    o.y = bounds * -2;
  } else if (o.y < bounds * -2) {
    o.y = canvas.height + bounds * 2;
  }
}

function getAstroidSet(size) {
  let astroidSet = []
  for (let i = 0; i<size; i++) {
    astroidSet[i] = new Astroid(5)
    stage.addChild(astroidSet[i])
    astroidSet[i].floatOnScreen(canvas.width, canvas.height)
  }
  return astroidSet
}


function getSpaceRock(size) {
  var i = 0;
  var len = rockBelt.length;

  //pooling approach
  while (i <= len) {
    if (!rockBelt[i]) {
      rockBelt[i] = new SpaceRock(size);
      break;
    } else if (!rockBelt[i].active) {
      rockBelt[i].activate(size);
      break;
    } else {
      i++;
    }
  }

  if (len == 0) {
    rockBelt[0] = new SpaceRock(size);
  }

  stage.addChild(rockBelt[i]);
  return i;
}

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
  //cross browser issues exist
  if (!e) {
    var e = window.event;
  }
  startGame()
  switch (e.keyCode) {
    case KEYCODE_A:
    case KEYCODE_LEFT:
      lfHeld = true;
      return false;
    case KEYCODE_D:
    case KEYCODE_RIGHT:
      rtHeld = true;
      return false;
    case KEYCODE_W:
    case KEYCODE_UP:
      fwdHeld = true;
      return false;
    case KEYCODE_SPACE:
      restart()
      return false;
  }
}

function handleKeyUp(e) {
  //cross browser issues exist
  if (!e) {
    var e = window.event;
  }
  switch (e.keyCode) {
    case KEYCODE_A:
    case KEYCODE_LEFT:
      lfHeld = false;
      break;
    case KEYCODE_D:
    case KEYCODE_RIGHT:
      rtHeld = false;
      break;
    case KEYCODE_W:
    case KEYCODE_UP:
      fwdHeld = false;
      break;
  }
}

function addScore(value) {
  //trust the field will have a number and add the score
  let score = Number(scoreField.text) + Number(value)
  scoreField.text = `Survival time: ${score}`
}


init()
