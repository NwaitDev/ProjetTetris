var context = null;

/**
 * déclaration des variables
 */

//Tetromino en cours d'utilisation :
var tetromino;

//couleur du prochain tetromino :
var nextColor = Math.ceil(Math.random()*7);

//prochain tetromino
var nextTetro;

//grille de jeu :
var grid = new Array();
for (let i = 0; i<10; i++){
    grid[i]=new Array();
    for (let j = 0; j<20; j++){
        grid[i][j]=0;
    }
}

//réinitialise la grille 
resetGrid = function resetGrid(grid){
    for (var i = 0; i<10; i++){
        for(var j = 0; j<20; j++){
            grid[i][j]=0;
        }
    }
}

//Level initial 
var START_LEVEL = 0;

//Level maximal 
const LEVEL_MAX = 9;

//fenêtre des scores 
var game;

//Largeur d'une case de la grille :
var tileWidth; 

//Hauteur d'une case de la grille :
var tileHeight; 

//Hauteur de la fenêtre des scores
var scoreWindowWidth = 100;

//variable utilisée pour mesurer le temps écoulé entre deux récursions :
var lastTimeUpdate = Date.now();

//variable utilisée pour mesurer le temps écoulé entre deux déplacements :
var lastMoveTime = Date.now();

//état d'appui des flèches directionnelles
var downKeyDown = false;
var upKeyDown = false;
var leftKeyDown = false;
var rightKeyDown = false;
var spaceKeyDown = false;

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
    return tetromino;
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
    tileWidth = (context.width-scoreWindowWidth)/10;
    tileHeight = (context.height)/20;
    tetromino = spawnTetromino();
    nextColor = Math.ceil(Math.random()*7);
    nextTetro = spawnTetromino();
    game = new game (START_LEVEL);
    runGame();

}



/**
 * Boucle de jeu
 */
runGame = function runGame() {
    update(Date.now());
    printStuff();
    if(!gameOver(tetromino)){
        requestAnimationFrame(runGame);
    }else { // faire affichage de la fenêtre gameOver (fonction tetroNul()) avec choix de continuer ou quitter le jeu
        for(let i = 0 ; i<10 ; i++){
            for(let j = 0 ; j<20 ; j++){
                    if(grid[i][j]==0){
                    grid[i][j] = Math.ceil(Math.random()*7);
                }
            }
        }
        printStuff();
        alert("GAME OVER");
        resetKeyDown();
        resetGrid(grid);
        game.resetGame();
        tetromino = spawnTetromino();
        nextColor = Math.ceil(Math.random()*7);
        nextTetro = spawnTetromino();
        requestAnimationFrame(runGame);
    }
}

/**
 * Affichage des éléments suivants : 
 * - grille de jeu
 * - tetromino en cours de placement
 * - scores 
 */
printStuff = function printStuff() {
    context.clearRect(0, 0, context.width, context.height);
    
    //affichage de la grille
    context.fillStyle = "#555";
    for(let i = 1; i<10;i++){
        context.fillRect(tileWidth*i-1,0,2,context.height);
    }
    for(let i = 1;i<=20;i++){
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

    ////affichage du score
    //Fenêtres
    context.fillStyle = "#555";
    context.fillRect(context.width-scoreWindowWidth,0,scoreWindowWidth,context.height);
    context.fillStyle = "#FFF";
    context.fillRect(context.width-scoreWindowWidth+5,20,scoreWindowWidth-10,scoreWindowWidth-10);
    context.fillRect(context.width-scoreWindowWidth+5,context.height/2+5,scoreWindowWidth-10,160);
    context.fillStyle = "#000";
    context.fillRect(context.width-scoreWindowWidth+10,25,scoreWindowWidth-20,scoreWindowWidth-20);
    context.fillRect(context.width-scoreWindowWidth+10,context.height/2+10,scoreWindowWidth-20,150);
    //texte
    context.font = "small-caps 20px Impact";
    context.fillStyle = "#FFF";
    context.fillText("Score :", context.width-scoreWindowWidth+15, context.height/2+28);
    context.fillText(game.score, context.width-scoreWindowWidth+15, context.height/2+53);
    context.fillText("Lines :", context.width-scoreWindowWidth+15, context.height/2+78);
    context.fillText(game.displayLines(), context.width-scoreWindowWidth+15, context.height/2+103);
    context.fillText("Level :", context.width-scoreWindowWidth+15, context.height/2+128);
    context.fillText(game.level, context.width-scoreWindowWidth+15, context.height/2+153);

    //affichage des blocs déjà placés
    for(let i = 0 ; i<10 ; i++){
        for(let j = 0 ; j<20 ; j++){
            if(grid[i][j]!=0){
                context.fillStyle = color(grid[i][j]);
                context.fillRect(i*tileWidth+1, j*tileHeight+1, tileWidth-2, tileHeight-2);
            }
        }
    }

    //affichage du prochain tetromino dans la fenêtre de prévisualisation
    context.fillStyle = color(nextTetro.color);
    context.fillRect(context.width-scoreWindowWidth+nextTetro.block1.x*tileWidth+1-50, nextTetro.block1.y*tileHeight+1+47, tileWidth-2, tileHeight-2);
    context.fillRect(context.width-scoreWindowWidth+nextTetro.block2.x*tileWidth+1-50, nextTetro.block2.y*tileHeight+1+47, tileWidth-2, tileHeight-2);
    context.fillRect(context.width-scoreWindowWidth+nextTetro.block3.x*tileWidth+1-50, nextTetro.block3.y*tileHeight+1+47, tileWidth-2, tileHeight-2);
    context.fillRect(context.width-scoreWindowWidth+nextTetro.block4.x*tileWidth+1-50, nextTetro.block4.y*tileHeight+1+47, tileWidth-2, tileHeight-2);
    
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
 * Fonction renvoyant l'intervalle de temps (en ms) entre deux descentes d'un tetromino
 */
fallTime = function(){
    return 1000-95*game.level;
}

/**
 * Fonction de mise à jour de l'état du jeu
 * @param {number} d date 
 */
update = function update(d) {
    if(d-lastTimeUpdate > fallTime() || (downKeyDown && d-lastTimeUpdate > 150)){
        tetromino.fall();
        if (downKeyDown){
            game.score++;
        }
        if(!tetromino.check()){
            tetromino.upShift();
            printInGrid();
            lines = completedLines(grid);
            if(lines.length !=0){
                deleteLines(lines,grid);
                game.updateGame(lines);
            }
            tetromino = spawnTetromino();
            nextColor = Math.ceil(Math.random()*7);
            nextTetro = spawnTetromino();
        }
        lastTimeUpdate = d;
    }
    if(rightKeyDown && d-lastMoveTime > 150){
        tetromino.rightShift();
        if(!tetromino.check()){
            tetromino.leftShift();
        }
        lastMoveTime = d;
    }
    if(leftKeyDown && d-lastMoveTime > 150){
        tetromino.leftShift();
        if(!tetromino.check()){
            tetromino.rightShift();
        }
        lastMoveTime = d;
    }
    if(upKeyDown && d-lastMoveTime > 150){
        tetromino = rotate(tetromino);
        lastMoveTime = d;
    }
    
    if (spaceKeyDown && d-lastTimeUpdate > 115 ){
       while (tetromino.check()){
           tetromino.fall();   
           game.score++;
        }
        if(!tetromino.check()){
            tetromino.upShift();
            printInGrid();
            game.score--;
            lines = completedLines(grid);
            if(lines.length !=0){
                deleteLines(lines,grid);
                game.updateGame(lines);
            }
            tetromino = spawnTetromino();
            nextColor = Math.ceil(Math.random()*7);
            nextTetro = spawnTetromino();
        }
        lastTimeUpdate = d;
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
                    res.block4.move(-2,-1);
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
completedLines = function(grid){
    var isCompleted = true;
    var res = [];
    let j = 0;
    for(var i = 0; i<20; i++){
        j = 0;
        while (isCompleted && j<10){
            if(grid [j][i] !=0){
                j++;
            }else{
                isCompleted = false;
            }
        }
        if(isCompleted){
            res.push(i);
        }
        isCompleted = true;
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
        case 32 :
            spaceKeyDown = true;
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
        case 32 :
            spaceKeyDown = false;
            break;
    }
}

/**
 * Action qui remet a faux l'état d'appui de toutes les touches directionnelles
 */
resetKeyDown = function resetKeyDown(){
    upKeyDown = false;
    downKeyDown = false;
    leftKeyDown = false;
    rightKeyDown = false;
    spaceKeyDown = false;
}

/**
 * Constructeur du type game
 * @param {number} START_LEVEL level initial au début de la partie
 */
var game = function (START_LEVEL) {
    this.level = START_LEVEL;
    this.score = 0;
    this.lines = 10*START_LEVEL;
    var self = this;
    

    /**
     * mise à jour du score, du nombre de lignes complétées et du level
     * @param {number []} completedLines lignes qui ont été complétées après un coup
     */
    this.updateGame = function (completedLines){
        //on gère comment si le nombre de lignes est de 0?

        switch (completedLines.length){
            case 1 :
                self.score += 40*(self.level+1);
                self.lines++;
            break;
            case 2 :
                self.score += 100*(self.level+1);
                self.lines += 2;
            break;
            case 3 :
                self.score += 300*(self.level+1);
                self.lines += 3;
            break;
            case 4 :
                self.score += 300*(self.level+1);
                self.lines += 4;
        }

        if (self.level <9 ){
            self.level = Math.floor(self.lines/10);
        }
    }

    /**
     * Mise a jour du nombre de lignes à afficher 
     */
    this.displayLines = function (){
        return self.lines-(10*START_LEVEL);
    }

    /**
     * Réinitialisation des variables 
     */
    this.resetGame = function (){
        self.level = START_LEVEL;
        self.lines = 10*START_LEVEL;
        self.score = 0;
    }
}

/**
 * Fonction vérifiant la possibilité de continuer la partie
 * @param {Tetromino} newTetromino prochain tetromino à jouer
 * @returns {boolean} vrai si la partie est finie
 */
gameOver = function (newTetromino){
    return !newTetromino.check();
}


/////////////Partie audio/////////////
var audio, playbtn, mutebtn, volumeslider;

function initAudioPlayer(){
    audio = new Audio();
    audio.src = "cytus-the-blocks-we-lovedampg.mp3";
    audio.loop = true;
    audio.play();   
    //initialisation des variables
    playbtn = document.getElementById("playpausebtn");
    mutebtn = document.getElementById("mutebtn");
    volumeslider = document.getElementById("volumeslider");
    //Fonctions (play/mute)
    playPause = function(){
        if(audio.paused){
            audio.play();
            playbtn.style.background = "url(icons/pause.png) no-repeat";
        }
        else{
            audio.pause();
            playbtn.style.background = "url(icons/play.png) no-repeat";
        }
    }
    ///
    mute = function(){
        if(audio.muted){
            audio.muted = false;
            mutebtn.style.background = "url(icons/speaker.png) no-repeat";
        }
        else{
            audio.muted = true;
            mutebtn.style.background = "url(icons/speaker_muted.png) no-repeat";
        }
    }
    ///
    setvolume = function(){
        audio.volume = volumeslider.value / 100;
    }

    //Ecouteur d'évènements
    playbtn.addEventListener("click",playPause);
    mutebtn.addEventListener("click",mute);
    volumeslider.addEventListener("mousemove",setvolume);
    
}

window.addEventListener("load", initAudioPlayer);
