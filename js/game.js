function main() {
  CANVAS_HEIGHT = 600;
  CANVAS_WIDTH = 600;
  MAX_LASERS = 3;
  ctx = $("#canvas")[0].getContext("2d");
  bg = $("#space_bg")[0];
  numEnemies = 4;
  entities = [];
  lasers = [];
  score = 0;
  gameOver = false;
  p = new Player();
  for (var i = 0; i < numEnemies; i++) {
    entities.push(new Enemy(i));
  }
  $(window).keydown(handleKey);
  //test();
  window.setTimeout(runLoop, 1000);
}

var test = function() {
  console.log("A");
  r1 = {
    "x": 0,
    "y": 0,
    "w": 10,
    "h": 10};
  r2 = {
    "x": 1,
    "y": 1,
    "w": 5,
    "h": 5};
  r3 = {
    "x": 100,
    "y": 100,
    "w": 5,
    "h": 5};
  console.log(intersects(r1, r2));
  console.log(intersects(r1, r3));
};


var intersects = function(a, b) {
  if (a.x+a.w<b.x || b.x+b.w<a.x || a.y+a.h<b.y || b.y+b.h<a.y) {
    return false;
  }
  return true;
};

var handleKey = function(evt) {
  console.log(evt.which);
  if (evt.which == 38) { // move up
    p.up = true;
    p.down = false;
  } else if (evt.which == 40) { // move down
    p.up = false;
    p.down = true;
  } else if (evt.which == 16) { // shoot
    p.shoot = true;
  } else if (evt.which == 82 && gameOver) {
    main();
  }
};

var runLoop = function() {
  drawBg();
  p.draw();
  p.update();

  // Update enemies
  for (var i = 0; i < entities.length; i++) {
    entities[i].draw();
    entities[i].update();
  }

  // Update lasers
  for (var j = 0; j < lasers.length; j++) {
    lasers[j].draw();
    lasers[j].update();
  }

  // Remove any dead enemies/lasers
  lasers = lasers.filter(function(laser) {return !laser.dead;});
  entities = entities.filter(function(entity) {return !entity.dead;});

  // Add new enemies to replace the dead ones
  for (var e = 0; e < numEnemies - entities.length; e++) {
    entities.push(new Enemy(e));
  }

  // Update the score
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(score, CANVAS_WIDTH - 50, CANVAS_HEIGHT - 10);
  if (!gameOver) {
    window.setTimeout(runLoop, 10);
  } else {
    drawBg();
    ctx.font = "50px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Game over", CANVAS_WIDTH/4, CANVAS_HEIGHT/2);
    ctx.fillText("Score: " + score, CANVAS_WIDTH/4, CANVAS_HEIGHT*0.75);
    ctx.font = "20px Arial";
    ctx.fillText("Press R to restart", CANVAS_WIDTH/4, CANVAS_HEIGHT*0.9);
  }
};


var drawBg = function() {
  ctx.drawImage(bg, 0, 0);
};


var Player = function() {
  this.x = 0;
  this.y = CANVAS_HEIGHT/2;
  this.w = 25;
  this.h = 25;
  this.img = $("#max")[0];
  this.up = false;
  this.down = false;
  this.shoot = true;
  this.speed = 30;
};

Player.prototype.draw = function() {
  ctx.fillStyle = "#f0f";
  ctx.drawImage(this.img, this.x, this.y);
};

Player.prototype.update = function() {
  if (this.up) {
    this.y -= this.speed;
  } else if (this.down) {
    this.y += this.speed;
  }
  if (this.shoot) {
    if (lasers.length < MAX_LASERS) {
      lasers.push(new Laser(this.x, this.y + this.h/2));
    }
  }
  this.up = false;
  this.down = false;
  this.shoot = false;
  if (score > 1000) {
    this.img = $("#alex")[0];
    console.log("SUP");
  }
};


var Enemy = function(x) {
  this.img = $("#alan")[0];
  this.w = this.img.width;
  this.h = this.img.height;
  this.x = CANVAS_WIDTH + x*this.w*2 + Math.random()*this.w*5;
  this.y = Math.random()*CANVAS_WIDTH;
  this.speed = 5;
  this.dead = false;
};

Enemy.prototype.draw = function() {
  ctx.fillStyle = "#f0f";
  ctx.drawImage(this.img, this.x, this.y);
};

Enemy.prototype.update = function() {
  this.x -= this.speed;
  if (this.x + this.w < 0) {
    this.dead = true;
  }
  // Detect enemy/player detection and make a game over.
  if (!this.dead && intersects(this, p)) {
    gameOver = true;
  }
};

var Laser = function(x, y) {
  this.x = x;
  this.y = y;
  this.r = 5;
  this.w = this.r;
  this.h = this.r;
  this.speed = 10;
  this.dead = false;
};

Laser.prototype.draw = function() {
  ctx.fillStyle = "#f00";
  ctx.fillRect(this.x, this.y, this.r, this.r);
};

Laser.prototype.update = function() {
  this.x += this.speed;
  for (var i = 0; i < entities.length; i++) {
    if (containedIn(entities[i], this)) {
      entities[i].dead = true;
      this.dead = true;
      score += 100;
      return;
    }
  }
  if (this.x > CANVAS_WIDTH) {
    this.dead = true;
  }
};

/* Checks if b is contained in a */
var containedIn = function(a, p) {
  if (
    p.x < a.x + a.w && 
    p.x > a.x && 
    p.y < a.y + a.h && 
    p.y > a.y) {
    return true;
  }
  return false;
};


