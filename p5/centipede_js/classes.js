var BOARD_WIDTH = 400;
var BOARD_HEIGHT = 600;
var GRID_SIZE = 20;
var BORDER_RIGHT = 0;
var BORDER_LEFT = 0;
var CHANCE = 5;
var DELAY = 17;
var CENTIPEDE_LENGTH = 10;
var SEGMENT_HEIGHT = GRID_SIZE;
var SEGMENT_WIDTH = GRID_SIZE;
var PLAYER_AREA_HEIGHT = 100;
var H_SPACE = 6;
var V_SPACE = 1;
var START_Y = BOARD_HEIGHT - PLAYER_AREA_HEIGHT - GRID_SIZE;
var START_X = BOARD_WIDTH / 2;

class Sprite{
    constructor(){
        this.img = null;
        this.x = 0;
        this.y = 0;
        this.height = 0;
        this.width = 0;
        this.hits = 0;
        this.dead = false; 
    }

    setImage(img){
        this.img = img;
        this.width = this.img.width;
        this.height = this.img.height;
    }

    show(){
        image(this.img,this.x,this.y)
    }

    isDead(){
        return this.dead;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    intersects(s2){
        return (s2.x <= this.x + this.width && 
            s2.x + s2.width >= this.x       && 
            s2.y <= this.y + this.height    &&
            s2.y + s2.width >= this.y);
    }
}


class Segment extends Sprite {

    constructor(x,y,head) {
        super();
        this.x = x;
        this.y = y;
        this.head = head;
        this.direction = -1;

        if(head){
            super.setImage(headImg);
            this.setRevImage(headRevImg);
        }else{
            super.setImage(segImg);
            this.setRevImage(segRevImg);
        }

    }

    show(){
        if(this.direction == -1){
            image(this.img,this.x,this.y);
        }else{
            image(this.revImg,this.x,this.y);
        }
    }

    setHead(){
        this.head = true;
        super.setImage(headImg);
        this.setRevImage(headRevImg);
    }

    setRevImage(revImg){
        this.revImg = revImg;
    }

    hit(){
        this.hits += 1;
        if(this.hits == 1){
            if(!this.head) {
                super.setImage(segHitImg);
                this.setRevImage(segRevHitImg);
            }
        }else if(this.hits == 2){
            this.dead = true;
        }
    }
}

class Player extends Sprite {
    constructor() {
        super();
        super.setImage(playerImg);
        this.x = START_X;
        this.y = START_Y;
        this.lives = 3;
    }

    hit(){
        this.x = START_X;
        this.y = START_Y;
        this.lives -= 1;
        if(this.lives <= 0){
            this.dead = true;
        }
    }

    move(){
        if(keyIsDown(LEFT_ARROW) && (this.x - 2 >= 0)){
            this.x -= 2;
        }else if(keyIsDown(RIGHT_ARROW) && (this.x + this.width + 2 <= BOARD_WIDTH)){
            this.x += 2;
        }

        if(keyIsDown(UP_ARROW) && (this.y - 2 >= 0)){
            this.y -= 2;
        }else if(keyIsDown(DOWN_ARROW) && (this.y + this.height + 2 <= BOARD_HEIGHT)){
            this.y += 2;
        }
    }

}

class Shot extends Sprite {

    constructor(x,y) {
        super();
        super.setImage(shotImg);
        this.x = x + H_SPACE;
        this.y = y - V_SPACE;
        this.width = 2;
        this.height = 12;
    }

    move(){
        this.y -= SHOT_SPEED;
        if(this.y < 0){
            this.dead = true;
        }
    }
}

class Mushroom extends Sprite {
    constructor(x,y) {
        super();
        this.x = x;
        this.y = y;
        this.hits = 0;
        super.setImage(mushroomImg);
    }

    hit(){
        this.hits += 1;
        if(this.hits == 1){
            this.setImage(mushroom1Hit);
        }else if(this.hits == 2){
            this.setImage(mushroom2Hit);
        }else if(this.hits == 3){
            this.dead = true;
        }
    }

    restore(){
        if(this.hits != 0){
            this.hits = 0;
            this.setImage(mushroomImg);
            return 1;
        }else{
            return 0;
        }
    }
}

class Spider extends Sprite{
    constructor() {
        super()
        super.setImage(spiderImg);
        this.y = BOARD_HEIGHT - PLAYER_AREA_HEIGHT - GRID_SIZE * 2;
        this.x = 0;
        this.dx = 1.5;
        this.dy = 1.5;
    }

    move(){

        this.x += this.dx;
        this.y += this.dy;

        if(this.y <= BOARD_HEIGHT - PLAYER_AREA_HEIGHT * 2){
            this.dy = Math.abs(this.dy);
        }else if(this.y >= BOARD_HEIGHT - 5 * 6){
            this.dy = -Math.abs(this.dy);
        }

        if(this.x <= BORDER_LEFT){
            this.dx = Math.abs(this.dx);
        }else if(this.x >= BOARD_WIDTH - this.width - BORDER_RIGHT){
            this.dx = -Math.abs(this.dx);
        }
    }

    hit(){
        this.hits += 1;
        if(spider.hits == 2){
            this.x = 0;
            this.y = BOARD_HEIGHT - PLAYER_AREA_HEIGHT - GRID_SIZE * 2;

            this.dx = (random(4) + 10)/10 * this.dx;
            this.dy = (random(4) + 10)/10 * this.dx;

            score += 50;
            this.hits = 0;
            print('Spider Dead',this.dx,this.dy);
        }
    }
}

class Centipede {

    constructor(s, x, y){
        if(arguments.length == 0){
            s = CENTIPEDE_LENGTH;
            x = BOARD_WIDTH/2 - ((BOARD_WIDTH/2)%GRID_SIZE) + (CENTIPEDE_LENGTH/2)*GRID_SIZE;
            y = GRID_SIZE * 2;
        }

        this.segments = Array();
        this.size = s;

        for(i = 0; i < s - 1; i++) {
            this.segments.push(new Segment(x,y,false));
            x -= SEGMENT_WIDTH;
        }

        this.segments.push(new Segment(x,y,true));
    }

    split(idx){
        if(this.segments[idx].isDead()) {
            this.size -= 1;
            if (idx == 0) {
                this.segments.splice(idx,1);
            } else {
                this.segments.splice(idx,1);
                let head = this.segments[idx - 1];
                head.setHead();
                head.direction = -head.direction; //TODO: Spwan mushroom here
            }
        }
    }

    show(){
        for(i = 0; i < this.segments.length; i++){
            this.segments[i].show();
        }
    }

    move(){
        //For loop thorugh all segments and then move the last segment
        for(i = 0; i < this.segments.length; i++) {
            if(!this.segments[i].head) {
                this.segments[i].setX(this.segments[i + 1].x);
                this.segments[i].setY(this.segments[i + 1].y);
                this.segments[i].direction = this.segments[i + 1].direction;

            }else{
                let head = this.segments[i];
                head.setX(head.x + (SEGMENT_WIDTH) * head.direction);

                if (head.x >= BOARD_WIDTH - BORDER_RIGHT || head.direction == 1 && grid[head.y / GRID_SIZE][head.x / GRID_SIZE] == 1) {
                    head.direction = -1;
                    head.setX(head.x + (SEGMENT_WIDTH) * head.direction);
                    head.setY(head.y + SEGMENT_HEIGHT);
                }

                if (head.x < BORDER_LEFT || head.direction == -1 && grid[head.y / GRID_SIZE][head.x / GRID_SIZE] == 1) {
                    head.direction = 1;
                    head.setX(head.x + (SEGMENT_WIDTH) * head.direction);
                    head.setY(head.y + SEGMENT_HEIGHT);
                }

                if (head.y >= BOARD_HEIGHT - PLAYER_AREA_HEIGHT) {
                    head.setY(BOARD_HEIGHT - PLAYER_AREA_HEIGHT - SEGMENT_HEIGHT);
                }
            }
        }
    }
}
