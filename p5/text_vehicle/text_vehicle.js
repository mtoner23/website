// Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// Video: https://www.youtube.com/watch?v=4hA7G3gup-4

var font;
var vehicles = [];
var points;
var fontSize = 150;
var pad = 50;
var string = 'Welcome';
var ptRad = 5;
var f = 0;
let speedSlider;
var canvas;

function preload() {
  font = loadFont('p5/text_vehicle/fonts/AvenirNextLTPro-Demi.otf');
  //font = loadFont('Affectionately Yours - OTF.otf');
}

function setup() {
  let fontBox = font.textBounds(string, 0, 0, fontSize);
  var scaleX = windowWidth/fontBox.w;
  var scaleY = windowHeight/fontBox.h;

  canvas = createCanvas(fontBox.w + 2 * pad, fontBox.h + 2 * pad);
  canvas.parent('text_vehicle');
  background(51);

  points = font.textToPoints(string, pad, fontBox.h + pad, fontSize, {
    sampleFactor: 0.2
  });

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x, pt.y, ptRad);
    vehicles.push(vehicle);
  }

  input = createInput();
  input.position(canvas.position().x, canvas.position().y);
  input.parent('text_vehicle')
  input.style('background: rgb(51,51,51)')
  input.style('color: rgb(200,200,200)');

  // twitter = createImg('images/twitter.png')
  // twitter.position(canvas.position().x,canvas.position().y + input.h);
  // twitter.size(32,32);

  // github = createImg('images/github.png');
  // github.position(canvas.position().x,canvas.position().y + input.h);
  // github.size(32,32);


  button = createButton('Enter');
  button.position(input.x + input.width, input.y);
  button.mouseClicked(editText);

  frameRate(30);
}

function editText(){
  string = input.value();

  let fontBox = font.textBounds(string, 0, 0, fontSize)
  resizeCanvas(fontBox.w + 2 * pad, fontBox.h + 2 * pad);
  input.position(canvas.position().x, canvas.position().y);
  button.position(input.x + input.width, input.y);
  //background(51);

  newPoints = font.textToPoints(string, pad, fontBox.h + pad, fontSize, {
    sampleFactor: 0.2
  });

  let i;

  for (i = 0; i < points.length && i < newPoints.length; i++) {
    vehicles[i].target = createVector(newPoints[i].x, newPoints[i].y);
  }

  if(i == points.length){
    for(i; i < newPoints.length; i++){
      var vehicle = new Vehicle(newPoints[i].x,newPoints[i].y,ptRad);
      vehicles.push(vehicle);
    }
  }else if(i == newPoints.length){
    vehicles.splice(i,points.length - newPoints.length);
  }

  points = newPoints;

}

function mousePressed(){
  var mouse = createVector(mouseX, mouseY);
 	for (var v in vehicles){
   	vehicles[v].flee(mouse,3);
  }
}

function draw() {
  background(51);
  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    var next = points[(i + f) % points.length];
    var nextTarget = createVector(next.x, next.y);
    let nextColor = vehicles[(i+1)%vehicles.length].color;
    v.flow(nextColor);
    //v.follow(nextTarget,vehicles[(i+f)%points.length]);
    v.behaviors();
    v.update();
    v.show();
  }
  f = (f + 1) % points.length;
}

function keyPressed(){
  print('TESTING');
  if(keyCode == 'ENTER' || keyCode == 'RETURN'){
    editText();
  }
}