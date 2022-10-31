
// Just a fun little game I made :D

 
const plyr  = new rigidbody();
const block = new staticbody();
const autolose = false
let pts = 0;
let blocks = []
let frameBuffer = []
let dt = 0.5;
let pg;
let level = 2;
let lcolor;
let h;
let r;
let pause = 0;
let sv = true;
let dmg = 1;
function clamp(num=0, min=0.1, max=0.1) {
  return Math.min(Math.max(min, num), max)
}

function setup() {
  
  h=height;
  createCanvas(400, 400);
  pg = createGraphics(400, 400)

  // player settings
  {
  plyr.x      = 56;
  plyr.y      = 56;
  plyr.width  = 10; 
  plyr.height = 10; 
  plyr.color  = color(255,230,22)
  plyr.stroke = true;
  plyr.slidex = 0.1;
  plyr.slidey = 0.1;
  plyr.mmf    = 0.1;
  plyr.dx     = 0;
  plyr.dy     = 0;  
  plyr.bm     = 0.5;
  plyr.mvx    = 10;
  plyr.superjump = 0; 
  plyr.skipyphysicsframe = false; 
  }
  
  // block settings 
  r = function(){
    
    let bx =-45
    let by = 50;
    let lw = 50;
    level++
    lcolor = color(Math.random(level)*255,Math.random(level)*255,Math.random(level)*255);
    for (let i=0;i<9;i++) {
      let block = new staticbody();
      bx+=lw+5
      lw           = Math.abs(Math.random()*30)+20
      block.x      = bx;
      block.y      = height-by+40;
      block.health = level**1.2; 
      block.width  = lw-5; 
      block.height = 15; 
      block.color  = lcolor; 
      block.stroke = true;
      block.objtype = "rect";
      blocks.push(block)
      
      
      
    }


  }
  r()
  newblocks()
  
}

function draw() {
  pg.background(220);
  pg.textSize(20)
  pg.fill(color(0,0,0))
  pg.text("level: "+(level-4),10,40)
  pg.textSize(10)
  pg.text("damage level: " + dmg, 10, 60)
   pg.text(Math.round((pts/300)*100) + "%", width/2-3, 55)
  if (Math.round((pts/300)*100)>=100 && pts>=300) {pg.fill(color(255,0,0));plyr.superjump=50; dmg+=0.4}
  if (plyr.superjump>0) {pg.fill(color(255,0,0)); 
                    pg.text("SUPERJUMP ACTIVATED",width/2-60,40); pts-=0.6}
  else   pg.fill(color(0,255,0))
  

  pg.rect(width/2-(pts/3)/2, 60, pts/3, 5)

  //game loop
  
  {
  plyr.dy+=0.5;
  
  //player movement
  {
   
    if (keyIsDown(68)) {
      plyr.dx += 0.8;
    }
    else if (keyIsDown(65)) {
      plyr.dx -=0.8;
    }
    if (plyr.dx < 0) plyr.dx+=0.1
    else if (plyr.dx > 0) plyr.dx-=0.1
    
  }
  
  //fall faster and super jump mechanic
  {
   
   if (keyIsDown(32) && plyr.superjump>0) {plyr.bm =0.99; plyr.dy += 20;}
   else if (keyIsDown(32)) plyr.dy += 2;
   if (plyr.superjump>0) { plyr.superjump-=0.1 }
   else plyr.bm = 0.6
    
  }
  
  //ground/walls collision & grav
  {

  if (plyr.y+plyr.dy*dt>=height-5 || plyr.y+plyr.dy*dt<=5) {
   
    plyr.dy = -plyr.dy*plyr.bm-2;
  
  }
  if (plyr.x+plyr.dx*dt>=width-10  || plyr.x+plyr.dx*dt<=10) {
    plyr.dx = -plyr.dx*plyr.bm;
  }
 
  }
  
  //draw & block functions
  { 
  
    //block functions
  {
    
    //drawing blocks
    for (let b=0;b<blocks.length;b++) {
    pg.strokeWeight(3)
    blocks[b].draw(pg)
    
    pg.fill(0)
    pg.textSize(10)
    pg.text(Math.round(blocks[b].health), blocks[b].x, blocks[b].y)
    }
    
    //block collision
    for (let b=0;b<blocks.length;b++) {
      if (blocks[b].y<0 || autolose) {
        pg.textSize(32)
        pg.text("YOU LOSE!", 10,30)
        let btn = createButton("restart")
        btn.position(10,40);

        btn.mousePressed(function() {
          Cookies.set("level", level-4)
          console.log(document.cookie)
          setTimeout(function(){location.reload()},1000)
        })
        noLoop()
      }
      
      //if block health is 0 destroy the block
      //TODO: block paraticle effects
      if (blocks[b].health<=0) {
        blocks.splice(b,1);
        break;
        }
      
      //Top/Bottom collision
      if (blocks[b].collision(plyr,{x: plyr.dx*dt, y:plyr.dy*dt})) {
       
        plyr.dy = -plyr.dy*plyr.bm;

        if (blocks[b].health<=0) {
        blocks.splice(b,1);
        break;
        }
        else {
        
        if (abs(plyr.dy)>2) {
          pts++
         blocks[b].health-=abs(plyr.dy*dmg)
        }
 
         
    
        if (blocks[b].health<=0) {
            blocks.splice(b,1);
            break;
        } 

        }
      
   
      }
      
      //Left/right collision
      if (blocks[b].collisionSide(plyr,{x: plyr.dx*dt, y:plyr.dy*dt})) { 
        plyr.dx = -plyr.dx*plyr.bm
      }

    
    }
  }
  
  //draw the player and update physics
  pg.strokeWeight(1)
  plyr.draw(pg);
  rect(0,height-5,width,1)
  plyr.x += plyr.dx*dt;
  if (plyr.dy>1 || plyr.dy <-1) plyr.y += plyr.dy*dt;

  }
  
  
  }
  
 
  image(pg, 0, 0)
  
}

let timer = 5000;
let ll = 0
function newblocks() {
  console.log("ok")
  

  for (let b=0;b<blocks.length;b++) {
    blocks[b].y-=20;
  }
  r()

  setTimeout(newblocks,timer+pause)
}


