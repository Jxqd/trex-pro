//se agregan sus variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  // se cargan las animaciones e imagenes
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkpoint.mp3")
}

function setup() {
  var mensaje ="esto es un mensaje"
  console.log(mensaje);
  //se crea el canvas
  createCanvas(600, 200);
  //se crea el sprite de trex y animacion
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  //se pone su escala
  trex.scale = 0.5;
  //se crea el sprite y se agrega la imagen de ground
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  //se pone el ground en ciclo (loop)
  ground.x = ground.width /2;
//se crea sprite e imagen de game over
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  // lo mismo con start
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  //se pone la escala
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  //se crea su sprite
  invisibleGround = createSprite(200,190,400,10);
  //se pone invisible el piso
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  //se coloca el mensaje hola en la consola

  //se coloca una hitbox de un circulo 
  trex.setCollider("rectangle",0,0,110,trex.height);
  //el debug hace que se vea la hitbox
  trex.debug = true
  //se pone la variable score
  score = 0;
  
}

function draw() {

  //se pone el fondo gris
  background(180);
  //mostrar puntuación
  text("Puntuación: "+ score, 500,50);
  
  //console.log("esto es ",gameState)
  
  //se crea un if para poner el estado de PLAY
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover el suelo
    ground.velocityX = -(4+3*score/100);
    console.log(ground.velocityX);
    //puntuación
    score = score + Math.round(getFrameRate()/60);
    // cada vez que llegue a 100 sonara este sonido
    if(score>0 && score%100===0){
      checkpointSound.play();
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el trex salte al presionar la barra espaciadora
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer las nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      //trex.velocityY=-12
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0;
     
      //cambiar la animación del trex
      trex.changeAnimation("collided", trex_collided);
     
      //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //evitar que el trex caiga
  trex.collide(invisibleGround);
  if(mousePressedOver(restart)){
    console.log("Reinicia el juego");
    reset();
  }
  
  
  
  drawSprites();
}
function reset(){
  gameState=PLAY;
  gameState.visible=false;
  restart.visible=false;
  trex.changeAnimation("running",trex_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX=-(6+score/100)
   
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 300;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
    }
}

