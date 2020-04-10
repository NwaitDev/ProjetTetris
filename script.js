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

var scoreWindowHeight = 20;

//variable utilisée pour mesurer le temps écoulé entre deux récursions :
var lastTimeUpdate = Date.now();

//variable utilisée pour mesurer le temps écoulé entre deux déplacements :
var lastMoveTime = Date.now();

//état d'appui des flèches directionnelles
var downKeyDown = false;
var upKeyDown = false;
var leftKeyDown = false;
var rightKeyDown = false;

//ordonnée des lignes complétées :
var lines = new Array();

/**
 * Constructeur du type Block
 * @param {number} x 
 * @param {number} y 
 */
var Block = function (x, y) {
    this.x = x;
    this.y = y;
    var self = this;
    /**
     * décalage d'un bloc selon x et y
     * @param {int} xShift décalage du bloc selon l'abscisse
     * @param {int} yShift décalage du bloc selon l'ordonnée
     */
    this.move = function (xShift, yShift) {
        self.x += xShift;
        self.y += yShift;
    }
}

/**
 * Constructeur du type Tetromino
 * @param {Block} block1 premier bloc 
 * @param {Block} block2 deuxième bloc
 * @param {Block} block3 troisième bloc
 * @param {Block} block4 quatrième bloc
 * @param {number} color identifiant de la couleur du tetromino (entier entre 1 et 7)
 * @param {number} nbRot nombre de rotation du tetromino %4
 */
var Tetromino = function Tetromino(block1, block2, block3, block4, color, nbRot) {
    this.block1 = block1;
    this.block2 = block2;
    this.block3 = block3;
    this.block4 = block4;
    this.color = color;
    this.nbRot = nbRot;

    var self = this;

    /**
     * Vérification de la position du tetromino
     * @returns {boolean} true si le tetromino est dans la grille et non-superposé à un bloc
     */
    this.check = function () {
        let res = (grid[self.block1.x] !== undefined) &&
            (grid[self.block2.x] !== undefined) &&
            (grid[self.block3.x] !== undefined) &&
            (grid[self.block4.x] !== undefined);
        if (res) {
            res = (grid[self.block1.x][self.block1.y] == 0) &&
                (grid[self.block2.x][self.block2.y] == 0) &&
                (grid[self.block3.x][self.block3.y] == 0) &&
                (grid[self.block4.x][self.block4.y] == 0);
        }
        return res;
    }

    /**
     * renvoie un nouvel objet de type Tetromino de mêmes propriétés que le tetromino
     */
    this.copy = function () {
        return new Tetromino(
            new Block(self.block1.x, self.block1.y),
            new Block(self.block2.x, self.block2.y),
            new Block(self.block3.x, self.block3.y),
            new Block(self.block4.x, self.block4.y),
            self.color,
            self.nbRot
        );
    }

    /**
     * chute du tetromino
     */
    this.fall = function () {
        self.block1.y += 1;
        self.block2.y += 1;
        self.block3.y += 1;
        self.block4.y += 1;
    }
    
    /**
     * décalage à gauche du tetromino
     */
    this.leftShift = function () {
        self.block1.x -= 1;
        self.block2.x -= 1;
        self.block3.x -= 1;
        self.block4.x -= 1;
    }

    /**
     * décalage à droite du tetromino
     */
    this.rightShift = function () {
        self.block1.x += 1;
        self.block2.x += 1;
        self.block3.x += 1;
        self.block4.x += 1;
    }

    /**
     * décalage vers le haut du tetromino
     */
    this.upShift = function () {
        self.block1.y -= 1;
        self.block2.y -= 1;
        self.block3.y -= 1;
        self.block4.y -= 1;
    }
}

/**
 * remplace le tetromino en cours de placement par un autre tetromino en haut de la grille
 * @returns {Tetromino} un nouveau tetromino en haut de la grille
 */
spawnTetromino = function(){
    let tetromino;
    switch(nextColor){
        case 1 :
            tetromino = new Tetromino(
                new Block(4,0),
                new Block(3,0),
                new Block(5,0),
                new Block(6,0),
                1,
                0
            );
        break;
        case 2 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(3,1),
                new Block(3,0),
                new Block(5,1),
                2,
                0
            );
        break;
        case 3 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(5,1),
                new Block(5,0),
                new Block(3,1),
                3,
                0
            );
        break;
        case 4 :
            tetromino = new Tetromino(
                new Block(4,0),
                new Block(5,0),
                new Block(4,1),
                new Block(5,1),
                4,
                0
            );
        break;
        case 5 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(3,1),
                new Block(4,0),
                new Block(5,0),
                5,
                0
            );
        break;
        case 6 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(5,1),
                new Block(4,0),
                new Block(3,1),
                6,
                0
            );
        break;
        case 7 :
            tetromino = new Tetromino(
                new Block(4,1),
                new Block(5,1),
                new Block(4,0),
                new Block(3,0),
                7,
                0
            );
    }
    nextColor = Math.ceil(Math.random()*7);
    return tetromino;
}

/**
 * retourne le code Hexadécimal de la couleur d'un tetromino
 * @param {number} color Couleur du tetromino
 * @returns {String} Couleur en héxadécimale
 */
color = function color(color){
    switch (color){
        case 1 :
            return "#EDE";
        case 2 :
            return "#FF0";
        case 3 :
            return "#F0F";
        case 4 :
            return "#0FF";
        case 5 :
            return "#F00";
        case 6 :
            return "#0F0";
        case 7 :
            return "#00F";
    }
}

/**
 * enregistre dans la grille la position du tetromino
 */
printInGrid = function printInGrid(){
    grid[tetromino.block1.x][tetromino.block1.y] = tetromino.color;
    grid[tetromino.block2.x][tetromino.block2.y] = tetromino.color;
    grid[tetromino.block3.x][tetromino.block3.y] = tetromino.color;
    grid[tetromino.block4.x][tetromino.block4.y] = tetromino.color;
}

/**
 * retourne la version tournée d'un quart de tour du tetromino en paramètre
 * @param {Tetromino} tetromino 
 * @returns {Tetromino} la version tournée d'un quart de tour de tetromino (si possible)
 */
rotate = function (tetromino) {

    let res = tetromino.copy();

    switch (res.color) {
        case 1:
            switch (res.nbRot) {
                case 0:
                    res.block1.move(1, 0);
                    res.block2.move(2, -1);
                    res.block3.move(0, 1);
                    res.block4.move(-1, 2);
                    res.nbRot++;
                    break;
                case 1:
                    res.block1.move(0, 1);
                    res.block2.move(1, 2);
                    res.block3.move(-1, 0);
                    res.block4.move(-2, -1);
                    res.nbRot++;
                    break;
                case 2:
                    res.block1.move(-1, 0);
                    res.block2.move(-2, 1);
                    res.block3.move(0, -1);
                    res.block4.move(1, -2);
                    res.nbRot++;
                    break;
                case 3:
                    res.block1.move(0, -1);
                    res.block2.move(-1, -2);
                    res.block3.move(1, 0);
                    res.block4.move(2, 1);
                    res.nbRot=0;
                    break;
            }
            break;

        case 2:
            switch (res.nbRot) {
                case 0:
                    res.block2.move(1, -1);
                    res.block3.move(2, 0);
                    res.block4.move(-1, 1);
                    res.nbRot++;                  
                    break;
                case 1:
                    res.block2.move(1, 1);
                    res.block3.move(0, 2);
                    res.block4.move(-1, -1);
                    res.nbRot++;
                    break;
                case 2:
                    res.block2.move(-1, 1);
                    res.block3.move(-2, 0);
                    res.block4.move(1, -1);
                    res.nbRot++;
                    break;
                case 3:
                    res.block2.move(-1, -1);
                    res.block3.move(0, -2);
                    res.block4.move(1, 1);
                    res.nbRot = 0;
            }
            break;

        case 3:
            switch (res.nbRot) {
                case 0:
                    res.block2.move(-1, 1);
                    res.block3.move(0, 2);
                    res.block4.move(1,-1);
                    res.nbRot++;
                    break;
                case 1:
                    res.block2.move(-1, -1);
                    res.block3.move(-2, 0);
                    res.block4.move(1, 1);
                    res.nbRot++;
                    break;
                case 2:
                    res.block2.move(1, -1);
                    res.block3.move(0, -2);
                    res.block4.move(-1, 1);
                    res.nbRot++;
                    break;
                case 3:
                    res.block2.move(1, 1);
                    res.block3.move(2, 0);
                    res.block4.move(-1, -1);
                    res.nbRot = 0;
            }
            break;

        case 5:
            switch (res.nbRot) {
                case 0:
                    res.block2.move(1, -1);
                    res.block3.move(1, 1);
                    res.block4.move(0, 2);
                    res.nbRot++;
                    break;
                case 1:
                    res.block2.move(1, 1);
                    res.block3.move(-1, 1);
                    res.block4.move(-2, 0);
                    res.nbRot++;
                    break;
                case 2:
                    res.block2.move(-1, 1);
                    res.block3.move(-1, -1);
                    res.block4.move(0, -2);
                    res.nbRot++;
                    break;
                case 3:
                    res.block2.move(-1, -1);
                    res.block3.move(1, -1);
                    res.block4.move(2, 0);
                    res.nbRot = 0;
            }
            break;
            
        case 6:
            switch (res.nbRot) {
                case 0:
                    res.block2.move(-1, 1);
                    res.block3.move(1, 1);
                    res.block4.move(1, -1);
                    res.nbRot++;
                    break;
                case 1:
                    res.block2.move(-1, -1);
                    res.block3.move(-1, 1);
                    res.block4.move(1, 1);
                    res.nbRot++;
                    break;
                case 2:
                    res.block2.move(1, -1);
                    res.block3.move(-1, -1);
                    res.block4.move(-1, 1);
                    res.nbRot++;
                    break;
                case 3:
                    res.block2.move(1, 1);
                    res.block3.move(1, -1);
                    res.block4.move(-1, -1);
                    res.nbRot = 0;
            }
            break;
            
        case 7:
            switch (res.nbRot) {
                case 0:
                    res.block2.move(-1, 1);
                    res.block3.move(1, 1);
                    res.block4.move(2, 0);
                    res.nbRot++;
                    break;
                case 1:
                    res.block2.move(-1, -1);
                    res.block3.move(-1, 1);
                    res.block4.move(0, 2);
                    res.nbRot++;
                    break;
                case 2:
                    res.block2.move(1, -1);
                    res.block3.move(-1, -1);
                    res.block4.move(-2, 0);
                    res.nbRot++;
                    break;
                case 3:
                    res.block2.move(1, 1);
                    res.block3.move(1, -1);
                    res.block4.move(0, -2);
                    res.nbRot = 0;
            }
    }
    if (res.check()) {
        return res;
    } else {
        res.leftShift();
        if(res.check()){
            return res;
        }else{
            if(res.color==1){
                res.leftShift();
                if(res.check()){
                    return res;
                }else{
                    res.rightShift();
                }
            }
            res.rightShift();
            res.rightShift();
            if(res.check()){
                return res;
            }else{
                if(res.color==1){
                    res.rightShift();
                    if(res.check()){
                        return res;
                    }else{
                        res.leftShift();
                    }
                }
                res.leftShift();
                res.upShift();
                if(res.check()){
                    return res;
                }else{
                    return tetromino;
                }
            }
        }
    }
}

/**
 * Fonction vérifiant si une ligne de la grille est complétée
 * @param {Tetromino} tetromino tetromino qui s'est fixé sur la grille
 * @param {int[][]} grid grille de jeu
 * @returns {int[]} tableau des cases complétées
 */
completedLines = function(tetromino, grid){
    var isCompleted = true;
    var res = [];
    var i = 0;
    while (isCompleted && i<9){
        if(grid [i][tetromino.block1.y] !=0){
            i++;
        }else{
            isCompleted = false;
        }
    }
    if(isCompleted){
        res.push(tetromino.block1.y);
    }
    
    if (!res.includes(tetromino.block2.y)){
        i = 0; 
        isCompleted = true;
        while (isCompleted && i<9){
            if(grid [i][tetromino.block2.y] !=0){
                i++;
            }else{
                isCompleted = false;
            }
        }
        if(isCompleted){
            res.push(tetromino.block2.y);
        }
    }

    if(!res.includes(tetromino.block3.y)){
        i = 0; 
        isCompleted = true;
        while (isCompleted && i<9){
            if(grid [i][tetromino.block3.y] !=0){
                i++;
            }else{
                isCompleted = false;
            }
        }
        if(isCompleted){
            res.push(tetromino.block3.y);
        }
    }
    
    if(!res.includes(tetromino.block4.y)){
        i = 0; 
        isCompleted = true;
        while (isCompleted && i<9){
            if(grid [i][tetromino.block4.y] !=0){
                i++;
            }else{
                isCompleted = false;
            }
        }
        if(isCompleted){
            res.push(tetromino.block4.y);
        }
    }
    return res;
}

/**
 * Action de descente d'une ligne de la grille de jeu après la suppression d'une ligne
 * @param {number} y ordonnée de la ligne supprimée
 * @param {number[][]} grid grille de jeu
 */
 lineFall = function(y, grid){
    for (var i = 0; i < 10; i++){
        grid [i][y] = grid [i][y-1];
        grid [i][y-1] = 0;
    }
 }

/**
 * Action de suppression des lignes complétées
 * @param {number[]} lines indices des lignes à supprimer
 * @param {number[][]} grid grille de jeu
 */
deleteLines = function(lines, grid){
    let y;
    for (let i=0; i<lines.length; i++){
        y = lines[i];
        for (let x=0; x<9; x++){
            grid[x][y] = 0;
        }
        for (let k=y; k>0; k--){
            lineFall(k,grid);
        }
    }
}


/**
 * Fonction d'initialisation/lancement du jeu
 */
init = function() {
    context = document.getElementById("cvs").getContext("2d");
    context.width = document.getElementById("cvs").width;
    context.height = document.getElementById("cvs").height;
    document.addEventListener("keydown", appuiClavier);
    document.addEventListener("keyup", relacheClavier);
    tileWidth = context.width/10;
    tileHeight = (context.height-scoreWindowHeight)/20;
    tetromino = spawnTetromino();
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
    
    //affichage de la grille
    context.fillStyle = "#555";
    for(let i = 1; i<10;i++){
        context.fillRect(tileWidth*i-1,0,2,context.height);
    }
    for(let i = 1;i<20;i++){
        context.fillRect(0,tileHeight*i-1,context.width,2);
    }

    //affichage du tetromino
    context.fillStyle = "#FFF"
    context.fillRect(tetromino.block1.x*tileWidth, tetromino.block1.y*tileHeight, tileWidth, tileHeight);
    context.fillRect(tetromino.block2.x*tileWidth, tetromino.block2.y*tileHeight, tileWidth, tileHeight);
    context.fillRect(tetromino.block3.x*tileWidth, tetromino.block3.y*tileHeight, tileWidth, tileHeight);
    context.fillRect(tetromino.block4.x*tileWidth, tetromino.block4.y*tileHeight, tileWidth, tileHeight);
    context.fillStyle = color(tetromino.color);
    context.fillRect(tetromino.block1.x*tileWidth+1, tetromino.block1.y*tileHeight+1, tileWidth-2, tileHeight-2);
    context.fillRect(tetromino.block2.x*tileWidth+1, tetromino.block2.y*tileHeight+1, tileWidth-2, tileHeight-2);
    context.fillRect(tetromino.block3.x*tileWidth+1, tetromino.block3.y*tileHeight+1, tileWidth-2, tileHeight-2);
    context.fillRect(tetromino.block4.x*tileWidth+1, tetromino.block4.y*tileHeight+1, tileWidth-2, tileHeight-2);

    //affichage du score
    context.fillStyle = "#000";
    context.fillRect(0,context.height-scoreWindowHeight,context.width,scoreWindowHeight);
    context.font = "small-caps 20px Impact";
    context.fillStyle = "#FFF";
    context.fillText("Score :   Lines :  Level : ", 0, context.height-2);
    
    //affichage des blocs déjà placés
    for(let i = 0 ; i<10 ; i++){
        for(let j = 0 ; j<20 ; j++){
            if(grid[i][j]!=0){
                context.fillStyle = color(grid[i][j]);
                context.fillRect(i*tileWidth+1, j*tileHeight+1, tileWidth-2, tileHeight-2);
            }
        }
    }
    
}



/**
 * Fonction de mise à jour de l'état du jeu
 * @param {number} d date 
 */
update = function update(d) {
    if(d-lastTimeUpdate > 700 || (downKeyDown && d-lastTimeUpdate > 100)){
        tetromino.fall();
        if(!tetromino.check()){
            tetromino.upShift();
            printInGrid();
            lines = completedLines(tetromino, grid);
            if(lines.length !=0){
                deleteLines(lines,grid);
            }
            tetromino = spawnTetromino();
        }
        lastTimeUpdate = d;
    }
    if(rightKeyDown && d-lastMoveTime > 100){
        tetromino.rightShift();
        if(!tetromino.check()){
            tetromino.leftShift();
        }
        lastMoveTime = d;
    }
    if(leftKeyDown && d-lastMoveTime > 100){
        tetromino.leftShift();
        if(!tetromino.check()){
            tetromino.rightShift();
        }
        lastMoveTime = d;
    }
    if(upKeyDown && d-lastMoveTime > 100){
        tetromino = rotate(tetromino);
        lastMoveTime = d;
    }
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