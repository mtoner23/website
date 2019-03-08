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
var backgnd = '#F5EFEF';
var badWords = ['ass','penis','shit'];

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
  background(backgnd);

  points = font.textToPoints(string, pad, fontBox.h + pad, fontSize, {
    sampleFactor: 0.2
  });

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x, pt.y, ptRad);
    vehicles.push(vehicle);
  }

  input = createInput();
  input.parent('text_vehicle')

  input.style('border: 1 px');
  input.style('background',backgnd)
  //input.style('color: rgb(200,200,200)');


  button = createButton('Enter');
  button.mouseClicked(editText);
  button.style('background',backgnd)

  resizeSketch(fontBox);

  frameRate(30);
}

function resizeSketch(fontBox){
  resizeCanvas(fontBox.w + 2 * pad, fontBox.h + 2 * pad);
  input.position(canvas.position().x + canvas.position().w/2, canvas.position().y);
  button.position(input.position().x + input.width, input.position().y);
}

function editText(){
  string = checkString(input.value());

  let fontBox = font.textBounds(string, 0, 0, fontSize)

  resizeSketch(fontBox);

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

function checkString(string){
  for (var w in badWords){
    if(string.includes(badWords[w])){
      //input.value = 'BAD WORD!'
      return '!@&%*'
    }
  }
  return string;
}

function mousePressed(){
  var mouse = createVector(mouseX, mouseY);
 	for (var v in vehicles){
   	vehicles[v].flee(mouse,3);
  }
}

function draw() {
  background(backgnd);
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
  if(keyCode == ENTER || keyCode == RETURN){
    editText();
  }
}