var BOARD_WIDTH = 480;
var BOARD_HEIGHT = 540;
var GRID_SIZE = 20;
var BORDER_RIGHT = 0;
var BORDER_LEFT = 0;
var CHANCE = 5;
var DELAY = 17;
var SHOT_SPEED = 15;
var INIT_SPEED = 11;
var PLAYER_AREA_HEIGHT = 80;
var H_SPACE = 6;

var grid = [];
var speed = INIT_SPEED;
var wait = 0;
var score = 0;
var mute;

fontsize = 20;

function preload(){
	mushroomImg = loadImage("p5/centipede_js/images/mushroom.png");
	mushroom1Hit = loadImage("p5/centipede_js/images/mushroom1Hit.png");
	mushroom2Hit = loadImage("p5/centipede_js/images/mushroom2Hit.png");
	playerImg = loadImage("p5/centipede_js/images/player_2x.png");
	shotImg = loadImage("p5/centipede_js/images/shot.png");
	spiderImg = loadImage('p5/centipede_js/images/spider.png');
	segHitImg = loadImage("p5/centipede_js/images/segment_hit.png");
	segRevHitImg = loadImage("p5/centipede_js/images/segment_rotate_hit.png");
	segImg = loadImage("p5/centipede_js/images/segment.png");
	headImg = loadImage("p5/centipede_js/images/head.png");
	headRevImg = loadImage("p5/centipede_js/images/head_rotate.png");
	segRevImg = loadImage("p5/centipede_js/images/segment_rotate.png");

	shotSound = loadSound("p5/centipede_js/sounds/shot.wav")
	music = loadSound("p5/centipede_js/sounds/music.wav")

	font = loadFont('p5/centipede_js/fonts/SourceSansPro-Regular.otf');
}

function flipMute(){
	mute = !mute;
	if(mute){
		music.pause();
	}else{
		if(!music.isPlaying()){
			music.play();
		}
	}
}

function setup() {
	createCanvas(BOARD_WIDTH, BOARD_HEIGHT);

	for (i = 0; i < BOARD_HEIGHT/GRID_SIZE; i++){
		grid[i] = new Array(BOARD_WIDTH/GRID_SIZE);
	}

	reset();

	mute = true;

	textFont(font);

	muteButton = createButton('Mute/Unmute')
	muteButton.mousePressed(flipMute)
	muteButton.position(BOARD_WIDTH + 10, BOARD_HEIGHT/2);
}

function drawScore(){
	var scoreText = 'Score: ' + score.toString();
	fill(255)
	textSize(fontsize);
	textAlign(LEFT,CENTER);
	text(scoreText,fontsize/2,fontsize/2)
}

function draw() {
	// Displays the image at its actual size at povar (0,0)
	background(0,0,0)
	drawScore();

	var del_idx = -1;
	for (i = mushrooms.length - 1; i > 0; i--){
		if(typeof shot != 'undefined'){
			if(shot.intersects(mushrooms[i])){
				delete(shot);
				mushrooms[i].hit();
				score += 5;
				if(mushrooms[i].isDead()){
					grid[mushrooms[i].y/GRID_SIZE][mushrooms[i].x/GRID_SIZE] = 0;
					del_idx = i;
				}
			}
		}
		mushrooms[i].show();
	}

	if(del_idx != -1){
		mushrooms.splice(del_idx,1);
	}

	wait++;

	player.move();
	if(player.intersects(spider)){
		player.hit()
	}
	player.show();

	for(i = 0 ; i < player.lives; i++){
		image(playerImg,BOARD_WIDTH-(player.width*(i+1)),0)
	}

	for(i= 0; i < centipede.segments.length; i++) { //Player hits centipede
		var seg = centipede.segments[i];
		if (player.intersects(seg)){
			player.hit();
		}
	}

	if(typeof shot != 'undefined'){
		shot.move();

		for(i = centipede.segments.length - 1; i >= 0; i--) { //Shot hits centipede
			var seg = centipede.segments[i];
			if (shot.intersects(seg)) {
				seg.hit();
				centipede.split(i);
				shot.dead = true;
				break;
			}
			if (player.intersects(seg)){
				player.hit();
			}
		}
		if(shot.intersects(spider)){ //Shot hits spider
			spider.hit();
			shot.dead = true;
		}
		if(shot.isDead()){ //Shot leaves the screen
			delete(shot);
		}else{
			shot.show();
		}
	}

	spider.move();
	spider.show();

	if(wait >= speed) {
		centipede.move();
		wait = 0;
	}
	centipede.show();

	if(centipede.size == 0){
		score += 200;
		centipede = new Centipede()
	}

	if(player.isDead()){


		fill(150);
		stroke(255);
		rect(BOARD_WIDTH/8,BOARD_HEIGHT/3,BOARD_WIDTH*6/8,BOARD_HEIGHT/3);
		fill(255,0,0);
		stroke(200);
		textSize(60);
		textAlign(CENTER,CENTER);
		text('Game Over',BOARD_WIDTH/2,BOARD_HEIGHT/2 - 10);
		fill(0);
		textSize(20);
		text('Press \'r\' to play again',BOARD_WIDTH/2,BOARD_HEIGHT/2 + 60)
		noLoop();
	}

}

function reset(){
	mushrooms = [];
	let found = false;
	for ( i = 1 * GRID_SIZE; i < BOARD_HEIGHT - PLAYER_AREA_HEIGHT - GRID_SIZE; i += GRID_SIZE) { //TODO check out borders here
		for ( j = BORDER_LEFT + GRID_SIZE; j <= BOARD_WIDTH - BORDER_RIGHT - GRID_SIZE; j += GRID_SIZE) {
			grid[ i/GRID_SIZE ][ j/GRID_SIZE ] = 0;
			if(int(random(CHANCE)) == CHANCE - 1 || found) {
				found = true;
				if(grid[i/GRID_SIZE - 1][j/GRID_SIZE - 1] == 0 && grid[i/GRID_SIZE - 1][j/GRID_SIZE + 1] == 0) {
					m = new Mushroom(j, i);
					mushrooms.push(m);
					grid[i / GRID_SIZE][j / GRID_SIZE] = 1;
					found = false;
				}
			}
		}
	}

	player = new Player();
	spider = new Spider();
	centipede = new Centipede();
	score = 0;
}

function keyPressed(){
	if(key == 'r'){
		reset();
		loop();
	}
	if(key == ' '){
		if(typeof shot == 'undefined'){
			shot = new Shot(player.x,player.y);
			if(!mute){
				shotSound.play()
			}
		}
	}
	if(key == 'm'){
		flipMute();
	}
	return false;
}


