// Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// Video: https://www.youtube.com/watch?v=4hA7G3gup-4

function Vehicle(x, y,ptRad) {
  this.pos = createVector(random(width),random(height));
  this.target = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
  this.rad = ptRad;
  let dist = 
  this.color = {
    r : sin(0.06*x + 0) * width,
    g : sin(0.06*x + 2*PI/3) * width,
    b : sin(0.06*x + 4*PI/3) * width,
	}
	// this.r = random(256);
	// this.g = random(256);
	// this.b = random(256);
  
  this.maxspeed = 20;
  this.maxforce = 15;
}

Vehicle.prototype.behaviors = function() {
  var arrive = this.arrive(this.target);
  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse,1);

  arrive.mult(1);
  //flee.mult(5);

  this.applyForce(arrive);
  this.applyForce(flee);
}

Vehicle.prototype.follow = function(target,next){
  let dist = p5.Vector.sub(target,this.target);
  if(dist.mag() > 100){
   	this.pos = target;
    this.acc = createVector();
    this.vel = createVector();
  }
  this.target = target;
}

Vehicle.prototype.flow = function(nextColor){
 	 this.color = nextColor;
}

Vehicle.prototype.applyForce = function(f) {
  this.acc.add(f);
}

Vehicle.prototype.update = function() {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
}

Vehicle.prototype.show = function() {
	stroke(this.color.r,this.color.g,this.color.b);
  strokeWeight(this.rad);
  point(this.pos.x, this.pos.y);
}


Vehicle.prototype.arrive = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  var speed = this.maxspeed;
  if (d < 100) {
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
}

Vehicle.prototype.explode = function(targets){
 for (var target in targets){
   	t = createVector(target.x,target.y);
   	this.flee(t,2);
 }
}

Vehicle.prototype.flee = function(target,vel) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  if (d < 40 * vel) {
    desired.setMag(this.maxspeed);
    desired.mult(-1 * vel);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

