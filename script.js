var context = null;

/**
 * déclaration des variables
 */

//Tetromino en cours d'utilisation :
var tetromino;

//couleur du prochain tetromino :
var nextColor = Math.ceil(Math.random()*7);

//grille de jeu :
var grid = new Array();
for (let i = 0; i<10; i++){
    grid[i]=new Array();
    for(let j = 0; j<20;j++){
        grid[i][j]=0;
    }
}

//Largeur d'une case de la grille :
var tileWidth; 

//Hauteur d'une case de la grille :
var tileHeight; 

//variable utilisée pour mesurer le temps écoulé entre deux récursions :
var lastTimeUpdate = Date.now();

//variable utilisée pour mesurer le temps écoulé entre deux déplacements :
var lastMoveTime = Date.now();

//état d'appui des flèches directionnelles
var downKeyDown = false;
var upKeyDown = false;
var leftKeyDown = false;
var rightKeyDown = false;

/**
 * Constructeur du type Block
 * @param {abscisse} x 
 * @param {ordonnée} y 
 */
var Block = function(x,y){
    this.x = x;
    this.y = y;
}
/**
 * Constructeur du type Tetromino
 * @param {premier_bloc_du_tetromino} block1 
 * @param {deuxième_bloc_du_tetromino} block2 
 * @param {troisième_bloc_du_tetromino} block3 
 * @param {quatrième_bloc_du_tetromino} block4 
 * @param {couleur_du_tetromino} color 
 */
var Tetromino = function Tetromino(block1,block2,block3,block4,color){
    this.block1 = block1;
    this.block2 = block2;
    this.block3 = block3;
    this.block4 = block4;
    this.color = color;
}


/**
 * Fonction d'initialisation/lancement du jeu
 */
init = function init() {
    context = document.getElementById("cvs").getContext("2d");
    context.width = document.getElementById("cvs").width;
    context.height = document.getElementById("cvs").height;
    document.addEventListener("keydown", appuiClavier);
    document.addEventListener("keyup", relacheClavier);
    tileWidth = context.width/10;
    tileHeight = context.height/20;
    spawnTetromino();
    runGame();
}
/**
 * Boucle de jeu
 */
runGame = function runGame() {
    update(Date.now());
    printStuff();
    requestAnimationFrame(runGame);
}

/**
 * Affichage des éléments suivants : 
 * - grille de jeu (à finir)
 * - tetromino en cours de placement
 * - scores (à faire)
 */
printStuff = function printStuff() {
    context.clearRect(0, 0, context.width, context.height);
    context.fillStyle = color(tetromino.color);
    context.fillRect(tetromino.block1.x*tileWidth+1, tetromino.block1.y*tileHeight+1, tileWidth-2, tileHeight-2);
    context.fillRect(tetromino.block2.x*tileWidth+1, tetromino.block2.y*tileHeight+1, tileWidth-2, tileHeight-2);
    context.fillRect(tetromino.block3.x*tileWidth+1, tetromino.block3.y*tileHeight+1, tileWidth-2, tileHeight-2);
    context.fillRect(tetromino.block4.x*tileWidth+1, tetromino.block4.y*tileHeight+1, tileWidth-2, tileHeight-2);
    
    for(let i = 0 ; i<10 ; i++){
        for(let j = 0 ; j<20 ; j++){
            if(grid[i][j]!=0){
                context.fillStyle = color(grid[i][j]);
                context.fillRect(i*tileWidth+1, j*tileHeight+1, tileWidth-2, tileHeight-2);
            }
        }
    }
}

color = function color(color){
    switch (color){
        case 1 :
            return "#11F";
        case 2 :
            return "#F0F";
        case 3 :
            return "#FA5";
        case 4 :
            return "#11A";
        case 5 :
            return "#FF0";
        case 6 :
            return "F40";
        case 7 :
            return "#FFF";
    }
}

/**
 * remplace le tetromino en cours de placement par un autre tetromino en haut de la grille
 */
spawnTetromino = function spawnTetromino(){
    switch(nextColor){
        case 1 :
            tetromino = new Tetromino(
                new Block(4,0),
                new Block(3,0),
                new Block(5,0),
                new Block(6,0),
                1
            );
        break;
        case 2 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(3,1),
                new Block(3,0),
                new Block(5,1),
                2
            );
        break;
        case 3 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(5,1),
                new Block(5,0),
                new Block(3,1),
                3
            );
        break;
        case 4 :
            tetromino = new Tetromino(
                new Block(4,0),
                new Block(5,0),
                new Block(4,1),
                new Block(5,1),
                4
            );
        break;
        case 5 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(3,1),
                new Block(4,0),
                new Block(5,0),
                5
            );
        break;
        case 6 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(5,1),
                new Block(4,0),
                new Block(3,1),
                6
            );
        break;
        case 7 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(5,1),
                new Block(4,0),
                new Block(3,0),
                7
            );
    }
    nextColor = Math.ceil(Math.random()*7);
}



/**
 * Fonction de mise à jour de l'état du jeu
 * @param {Date} d 
 */
update = function update(d) {
    if(d-lastTimeUpdate > 700 || (downKeyDown && d-lastTimeUpdate > 100)){
        fall();
        if(!check()){
            upShift();
            printInGrid();
            spawnTetromino();
        }
        lastTimeUpdate = d;
    }
    if(rightKeyDown && d-lastMoveTime > 100){
        rightShift();
        if(!check()){
            leftShift();
        }
        lastMoveTime = d;
    }
    if(leftKeyDown && d-lastMoveTime > 100){
        leftShift();
        if(!check()){
            rightShift();
        }
        lastMoveTime = d;
    }
}

/**
 * Fonctions de déplacement du tetromino
 */

////////////////////////////
fall = function fall(){
    tetromino.block1.y+=1;
    tetromino.block2.y+=1;
    tetromino.block3.y+=1;
    tetromino.block4.y+=1;
}

leftShift = function leftShift(){
    tetromino.block1.x-=1;
    tetromino.block2.x-=1;
    tetromino.block3.x-=1;
    tetromino.block4.x-=1;
}

rightShift = function rightShift(){
    tetromino.block1.x+=1;
    tetromino.block2.x+=1;
    tetromino.block3.x+=1;
    tetromino.block4.x+=1;
}

upShift = function upShift(){
    tetromino.block1.y-=1;
    tetromino.block2.y-=1;
    tetromino.block3.y-=1;
    tetromino.block4.y-=1;
}
/////////////////////////////

/**
 * enregistre dans la grille la position du tetromino
 */
printInGrid= function printInGrid(){
    grid[tetromino.block1.x][tetromino.block1.y] = tetromino.color;
    grid[tetromino.block2.x][tetromino.block2.y] = tetromino.color;
    grid[tetromino.block3.x][tetromino.block3.y] = tetromino.color;
    grid[tetromino.block4.x][tetromino.block4.y] = tetromino.color;
}

/**
 * Vérification de la position du tetromino en cours de placement 
 */
check = function check(){
    let res = (grid[tetromino.block1.x]!==undefined)&&
    (grid[tetromino.block2.x]!==undefined)&&
    (grid[tetromino.block3.x]!==undefined)&&
    (grid[tetromino.block4.x]!==undefined);
    if (res){
        res = (grid[tetromino.block1.x][tetromino.block1.y]==0)&&
        (grid[tetromino.block2.x][tetromino.block2.y]==0)&&
        (grid[tetromino.block3.x][tetromino.block3.y]==0)&&
        (grid[tetromino.block4.x][tetromino.block4.y]==0);
    }
    return res;
}

appuiClavier = function appuiClavier(event){
    switch (event.keyCode){
      case 38 :
        upKeyDown = true;
        break;
      case 40 :
        downKeyDown = true;
        break;
      case 37 :
        leftKeyDown = true;
        break;
      case 39 :
        rightKeyDown = true;
        break;
    }
}
relacheClavier = function relacheClavier(event){
    switch (event.keyCode){
      case 38 :
        upKeyDown = false;
        break;
      case 40 :
        downKeyDown = false;
        break;
      case 37 :
        leftKeyDown = false;
        break;
      case 39 :
        rightKeyDown = false;
        break;
    }
}