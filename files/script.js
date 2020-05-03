var context = null;

/*
 * déclaration des variables
 */



//coordonées d'un clic
var clic = { x: 0, y: 0 };

//variable de jeu
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
        let grid = game.grid;
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
    /**
     * retourne la version tournée d'un quart de tour du tetromino
     */
    this.rotate = function () {

        let res = self.copy();
        let same = self.copy();

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
                        res.nbRot = 0;
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
                        res.block4.move(1, -1);
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
        }else{
            if(res.color !=1){
                res.leftShift()
                if(res.check()){
                    return res;
                }else{
                    res.rightShift();
                    res.rightShift();
                    if(res.check()){
                        return res;
                    }else{
                        res.leftShift();
                        res.upShift();
                        if(res.check()){
                            return res;
                        }else{
                            res.fall();
                            res.fall();
                            if(res.check){
                                return res;
                            }else{
                                return same;
                            }
                        }
                    }
                }
            }else{
                res.leftShift();
                if(res.check()){
                    return res;
                }else{
                    res.leftShift();
                    if(res.check()){
                        return res;
                    }else{
                        res.rightShift();
                        res.rightShift();
                        res.rightShift();
                        if(res.check()){
                            return res;
                        }else{
                            res.rightShift();
                            if(res.check()){
                                return res;
                            }else{
                                res.leftShift();
                                res.leftShift();
                                res.upShift();
                                if(res.check()){
                                    return res;
                                }else{
                                    res.upShift();
                                    if(res.check()){
                                        return res;
                                    }else{
                                        res.fall();
                                        res.fall();
                                        res.fall();
                                        if(res.check()){
                                            return res;
                                        }else{
                                            res.fall();
                                            if(res.check()){
                                                return res;
                                            }else{
                                                return same;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * remplace le tetromino en cours de placement par un autre tetromino en haut de la grille
 * @returns {Tetromino} un nouveau tetromino en haut de la grille
 */
spawnTetromino = function (nextColor) {
    let tetromino;
    switch (nextColor) {
        case 1:
            tetromino = new Tetromino(
                new Block(4, 0),
                new Block(3, 0),
                new Block(5, 0),
                new Block(6, 0),
                1,
                0
            );
            break;
        case 2:
            tetromino = new Tetromino(
                new Block(4, 1),
                new Block(3, 1),
                new Block(3, 0),
                new Block(5, 1),
                2,
                0
            );
            break;
        case 3:
            tetromino = new Tetromino(
                new Block(4, 1),
                new Block(5, 1),
                new Block(5, 0),
                new Block(3, 1),
                3,
                0
            );
            break;
        case 4:
            tetromino = new Tetromino(
                new Block(4, 0),
                new Block(5, 0),
                new Block(4, 1),
                new Block(5, 1),
                4,
                0
            );
            break;
        case 5:
            tetromino = new Tetromino(
                new Block(4, 1),
                new Block(3, 1),
                new Block(4, 0),
                new Block(5, 0),
                5,
                0
            );
            break;
        case 6:
            tetromino = new Tetromino(
                new Block(4, 1),
                new Block(5, 1),
                new Block(4, 0),
                new Block(3, 1),
                6,
                0
            );
            break;
        case 7:
            tetromino = new Tetromino(
                new Block(4, 1),
                new Block(5, 1),
                new Block(4, 0),
                new Block(3, 0),
                7,
                0
            );
    }
    return tetromino;
}

/**
 * Constructeur du type game
 */
var Game = function () {
    var self = this;
    this.startGame = false;
    this.level = 0;
    this.startLevel = 0;
    this.score = 0;
    this.lines = 0;
    this.completedLines = new Array();
    this.nextColor = Math.ceil(Math.random() * 7);
    //grille de jeu :
    this.grid =[];
    for (let i = 0; i < 10; i++) {
        this.grid[i] = new Array();
        for (let j = 0; j < 20; j++) {
            this.grid[i][j] = 0;
        }
    }
    //mise à jour de la couleur et retour de cette couleur;
    this.updateColor = function () {
        self.nextColor = Math.ceil(Math.random() * 7);
        return self.nextColor;
    }
    //Tetromino en cours d'utilisation
    this.tetromino = spawnTetromino(self.nextColor);
    //prochain tetromino
    this.nextTetro = spawnTetromino(self.updateColor());

    //mise à jour du tetromino et du prochain tetromino
    this.updateTetromino = function () {
        self.tetromino = spawnTetromino(self.nextColor);
        self.nextTetro = spawnTetromino(self.updateColor())
    }

    /**
     * Fonction vérifiant si une ligne de la grille est complétée
     * @returns {number[]} tableau des lignes complétées
     */
    this.completeLines = function () {
        let isCompleted = true;
        let res = [];
        let j;
        for (var i = 0; i < 20; i++) {
            j = 0;
            while (isCompleted && j < 10) {
                if (self.grid[j][i] != 0) {
                    j++;
                } else {
                    isCompleted = false;
                }
            }
            if (isCompleted) {
                res.push(i);
            }
            isCompleted = true;
        }
        self.completedLines = res;
    }

    /**
     * Suppression des lignes complétées
     */
    this.deleteLines = function () {
        let y;
        for (let i = 0; i < self.completedLines.length; i++) {
            y = self.completedLines[i];
            for (let x = 0; x < 10; x++) {
                self.grid[x][y] = 0;
            }
            for (let k = y; k > 0; k--) {
                self.lineFall(k);
            }
        }
    }

    /**
     * Descente d'une ligne de la grille de jeu après la suppression d'une ligne
     * @param {number} y ordonnée de la ligne supprimée
     */
    this.lineFall = function (y) {
        for (var i = 0; i < 10; i++) {
            self.grid[i][y] = self.grid[i][y - 1];
            self.grid[i][y - 1] = 0;
        }
    }

    /**
     * mise à jour du score, du nombre de lignes complétées et du level
     */
    this.updateGame = function () {
        switch (self.completedLines.length) {
            case 1:
                self.score += 40 * (self.level + 1);
                self.lines++;
                break;
            case 2:
                self.score += 100 * (self.level + 1);
                self.lines += 2;
                break;
            case 3:
                self.score += 300 * (self.level + 1);
                self.lines += 3;
                break;
            case 4:
                self.score += 300 * (self.level + 1);
                self.lines += 4;
        }
        self.level = Math.floor(self.lines / 10) + self.startLevel;
    }

    /**
     * enregistre dans la grille la position du tetromino
     */
    this.printInGrid = function printInGrid() {
        let grid = self.grid;
        let tetromino = game.tetromino;
        grid[tetromino.block1.x][tetromino.block1.y] = tetromino.color;
        grid[tetromino.block2.x][tetromino.block2.y] = tetromino.color;
        grid[tetromino.block3.x][tetromino.block3.y] = tetromino.color;
        grid[tetromino.block4.x][tetromino.block4.y] = tetromino.color;
    }

    /**
     * Fonction renvoyant l'intervalle de temps (en ms) entre deux descentes d'un tetromino
     */
    this.fallTime = function () {
        return Math.exp(-0.16 * game.level) * 1000;
    }

    /**
     * Fonction vérifiant la possibilité de continuer la partie
     * @returns {boolean} vrai si la partie est finie
     */
    this.gameOver = function () {
        return !self.tetromino.check();
    }
}

/**
 * Fonction d'initialisation/lancement du jeu
 */
init = function () {
    context = document.getElementById("cvs").getContext("2d");
    context.width = document.getElementById("cvs").width;
    context.height = document.getElementById("cvs").height;
    document.addEventListener("keydown", appuiClavier);
    document.addEventListener("keyup", relacheClavier);
    document.addEventListener("click", captureClicSouris)
    scoreWindowWidth = context.width / 3;
    tileWidth = (context.width - scoreWindowWidth) / 10;
    tileHeight = (context.height) / 20;
    game = new Game();
    runMenu();
}

runMenu = function runMenu() {
    printMenu();
    updateMenu();
    if (!game.startGame) {
        requestAnimationFrame(runMenu);
    } else {
        runGame();
    }
}

printMenu = function () {
    context.fillStyle = "#000";
    context.fillRect(0, 0, context.width, context.height);
    context.font = scoreWindowWidth * 0.2 + "px Impact";
    context.fillStyle = "#0F0";
    context.fillText("Tetris, a CMI adventure", context.width / 10, context.height / 3);
    context.fillStyle = "#F00";
    context.fillText("Choose difficulty :", context.width / 10, context.height / 2);
    for (let i = 0; i < 10; i++) {
        context.fillStyle = levelColor(i);
        context.fillText(i, context.width / 30 + i * context.width / 10, 2 * context.height / 3);
    }
    context.fillStyle = "#FF0"
    context.fillText("Start !", context.width / 10, 5 * context.height / 6);
}

updateMenu = function () {
    let leftBorder;
    let downBorder;
    let rightBorder;
    let upBorder;
    for (let i = 0; i < 10; i++) {
        leftBorder = context.width / 30 + i * context.width / 10;
        downBorder = 2 * context.height / 3;
        upBorder = downBorder - 20;
        rightBorder = leftBorder + 10;
        if (clic.x >= leftBorder && clic.x <= rightBorder && clic.y <= downBorder && clic.y >= upBorder) {
            game.startLevel = i;
            game.level = i;
        }
    }
    leftBorder = context.width / 10;
    rightBorder = leftBorder + 50;
    downBorder = 5 * context.height / 6;
    upBorder = downBorder - 20;

    if (clic.x >= leftBorder && clic.x <= rightBorder && clic.y <= downBorder && clic.y >= upBorder) {
        game.startGame = true;
        clic.x = 0;
        clic.y = 0;
    }
}

levelColor = function (i) {
    if (i == game.level) {
        return "#FFF";
    } else {
        return "#00F";
    }
}


/**
 * Boucle de jeu
 */
runGame = function runGame() {
    update(Date.now());
    printStuff();
    if (!game.gameOver()) {
        requestAnimationFrame(runGame);
    } else { // faire affichage de la fenêtre gameOver (fonction tetroNul()) avec choix de continuer ou quitter le jeu
        let alert = document.getElementById("myAlert");
        let confirm = document.getElementById("myConfirm");
       
        
        $(confirm).simpleConfirm({
            message: "GAMEOVER! \n Souhaites-tu rejouer une partie ?",
            success: function(){
                $(confirm).simpleConfirm({
                    message: "En es-tu certains ? Il y a pleins d'autres choses à faire pourtant...",
                    success: function(){
                        $(confirm).simpleConfirm({
                            message: "#restonscheznous",
                            success: function(){
                                $(confirm).simpleConfirm({
                                message: "Clique sur \"No\" sinon on va jamais en finir xD",
                                })
                            },
                            cancel: function(){
                                resetKeyDown();
                                game = new Game();
                                runMenu(); 
                            }
                        })
                    },
                    cancel: function(){
                        resetKeyDown();
                        game = new Game();
                        runMenu(); 
                    }
                })
            },
            cancel: function(){
                resetKeyDown();
                game = new Game();
                runMenu(); 
            }
        })
        
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
    for (let i = 1; i < 10; i++) {
        context.fillRect(tileWidth * i - 1, 0, 2, context.height);
    }
    for (let i = 1; i <= 20; i++) {
        context.fillRect(0, tileHeight * i - 1, context.width, 2);
    }

    //affichage du tetromino
    let tetromino = game.tetromino;
    context.fillStyle = "#FFF"
    context.fillRect(tetromino.block1.x * tileWidth, tetromino.block1.y * tileHeight, tileWidth, tileHeight);
    context.fillRect(tetromino.block2.x * tileWidth, tetromino.block2.y * tileHeight, tileWidth, tileHeight);
    context.fillRect(tetromino.block3.x * tileWidth, tetromino.block3.y * tileHeight, tileWidth, tileHeight);
    context.fillRect(tetromino.block4.x * tileWidth, tetromino.block4.y * tileHeight, tileWidth, tileHeight);
    context.fillStyle = color(tetromino.color);
    context.fillRect(tetromino.block1.x * tileWidth + 1, tetromino.block1.y * tileHeight + 1, tileWidth - 2, tileHeight - 2);
    context.fillRect(tetromino.block2.x * tileWidth + 1, tetromino.block2.y * tileHeight + 1, tileWidth - 2, tileHeight - 2);
    context.fillRect(tetromino.block3.x * tileWidth + 1, tetromino.block3.y * tileHeight + 1, tileWidth - 2, tileHeight - 2);
    context.fillRect(tetromino.block4.x * tileWidth + 1, tetromino.block4.y * tileHeight + 1, tileWidth - 2, tileHeight - 2);

    ////affichage du score
    //Fenêtres
    context.fillStyle = "#555";
    context.fillRect(context.width - scoreWindowWidth, 0, scoreWindowWidth, context.height);
    context.fillStyle = "#FFF";
    context.fillRect(context.width - scoreWindowWidth * 0.95, 0.2 * scoreWindowWidth, scoreWindowWidth * 0.9, scoreWindowWidth * 0.9);
    context.fillRect(context.width - scoreWindowWidth * 0.95, context.height / 2 + 0.05 * scoreWindowWidth, scoreWindowWidth - 0.1 * scoreWindowWidth, scoreWindowWidth * 1.6);
    context.fillStyle = "#000";
    context.fillRect(context.width - scoreWindowWidth + 0.1 * scoreWindowWidth, scoreWindowWidth / 4, scoreWindowWidth * 0.8, scoreWindowWidth * 0.8);
    context.fillRect(context.width - scoreWindowWidth + 0.1 * scoreWindowWidth, context.height / 2 + scoreWindowWidth * 0.1, scoreWindowWidth * 0.8, scoreWindowWidth * 1.5);
    //texte
    context.font = scoreWindowWidth * 0.2 + "px Impact";
    context.fillStyle = "#FFF";
    context.fillText("Score :", context.width - scoreWindowWidth * 0.85, context.height / 2 + scoreWindowWidth / 4 + 3);
    context.fillText(game.score, context.width - scoreWindowWidth * 0.85, context.height / 2 + scoreWindowWidth / 2 + 3);
    context.fillText("Lines :", context.width - scoreWindowWidth * 0.85, context.height / 2 + 3 * scoreWindowWidth / 4 + 3);
    context.fillText(game.lines, context.width - scoreWindowWidth * 0.85, context.height / 2 + scoreWindowWidth + 3);
    context.fillText("Level :", context.width - scoreWindowWidth * 0.85, context.height / 2 + 5 * scoreWindowWidth / 4 + 3);
    context.fillText(game.level, context.width - scoreWindowWidth * 0.85, context.height / 2 + 6 * scoreWindowWidth / 4 + 3);

    //affichage des blocs déjà placés
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 20; j++) {
            if (game.grid[i][j] != 0) {
                context.fillStyle = color(game.grid[i][j]);
                context.fillRect(i * tileWidth + 1, j * tileHeight + 1, tileWidth - 2, tileHeight - 2);
            }
        }
    }

    //affichage du prochain tetromino dans la fenêtre de prévisualisation
    let nextTetro = game.nextTetro;
    context.fillStyle = color(nextTetro.color);
    context.fillRect(context.width - scoreWindowWidth + nextTetro.block1.x * tileWidth + 1 - scoreWindowWidth / 2, nextTetro.block1.y * tileHeight + 0.48 * scoreWindowWidth, tileWidth - 2, tileHeight - 2);
    context.fillRect(context.width - scoreWindowWidth + nextTetro.block2.x * tileWidth + 1 - scoreWindowWidth / 2, nextTetro.block2.y * tileHeight + 0.48 * scoreWindowWidth, tileWidth - 2, tileHeight - 2);
    context.fillRect(context.width - scoreWindowWidth + nextTetro.block3.x * tileWidth + 1 - scoreWindowWidth / 2, nextTetro.block3.y * tileHeight + 0.48 * scoreWindowWidth, tileWidth - 2, tileHeight - 2);
    context.fillRect(context.width - scoreWindowWidth + nextTetro.block4.x * tileWidth + 1 - scoreWindowWidth / 2, nextTetro.block4.y * tileHeight + 0.48 * scoreWindowWidth, tileWidth - 2, tileHeight - 2);

}

/**
 * retourne le code Hexadécimal de la couleur d'un tetromino
 * @param {number} color Couleur du tetromino
 * @returns {String} Couleur en héxadécimale
 */
color = function color(color) {
    switch (color) {
        case 1:
            return "#EDE";
        case 2:
            return "#FF0";
        case 3:
            return "#F0F";
        case 4:
            return "#0FF";
        case 5:
            return "#F00";
        case 6:
            return "#0F0";
        case 7:
            return "#00F";
    }
}




/**
 * Fonction de mise à jour de l'état du jeu
 * @param {number} d date 
 */
update = function update(d) {
    let fallTime = game.fallTime();
    let tetromino = game.tetromino;
    if (d - lastTimeUpdate > fallTime || (downKeyDown && d - lastTimeUpdate > 150)) {
        tetromino.fall();
        if (downKeyDown) {
            game.score++;
        }
        if (!tetromino.check()) {
            tetromino.upShift();
            game.printInGrid();
            game.completeLines();
            if (game.completedLines.length != 0) {
                setTimeout(game.deleteLines, fallTime); //deleteLines();
                setTimeout(game.updateGame, fallTime); //game.updateGame();
            }
            resetKeyDown();
            game.updateTetromino();
        }
        lastTimeUpdate = d;
    }
    if (rightKeyDown && d - lastMoveTime > 150) {
        tetromino.rightShift();
        if (!tetromino.check()) {
            tetromino.leftShift();
        }
        lastMoveTime = d;
    }
    if (leftKeyDown && d - lastMoveTime > 150) {
        tetromino.leftShift();
        if (!tetromino.check()) {
            tetromino.rightShift();
        }
        lastMoveTime = d;
    }
    if (upKeyDown && d - lastMoveTime > 150) {
        game.tetromino = game.tetromino.rotate();
        lastMoveTime = d;
    }

    if (spaceKeyDown && d - lastTimeUpdate > 50) {
        while (tetromino.check()) {
            tetromino.fall();
            game.score++;
        }
        if (!tetromino.check()) {
            tetromino.upShift();
            game.printInGrid();
            game.score--;
            game.completeLines();
            if (game.completedLines.length != 0) {
                setTimeout(game.deleteLines, fallTime); //deleteLines();
                setTimeout(game.updateGame, fallTime); //game.updateGame();
            }
            resetKeyDown();
            game.updateTetromino();
        }
        lastTimeUpdate = d;
    }
}













appuiClavier = function appuiClavier(event) {
    switch (event.keyCode) {
        case 38:
            upKeyDown = true;
            break;
        case 40:
            downKeyDown = true;
            break;
        case 37:
            leftKeyDown = true;
            break;
        case 39:
            rightKeyDown = true;
            break;
        case 32:
            spaceKeyDown = true;
            break;
    }
}

relacheClavier = function relacheClavier(event) {
    switch (event.keyCode) {
        case 38:
            upKeyDown = false;
            break;
        case 40:
            downKeyDown = false;
            break;
        case 37:
            leftKeyDown = false;
            break;
        case 39:
            rightKeyDown = false;
            break;
        case 32:
            spaceKeyDown = false;
            break;
    }
}

/**
 * Action qui remet a faux l'état d'appui de toutes les touches directionnelles
 */
resetKeyDown = function resetKeyDown() {
    upKeyDown = false;
    downKeyDown = false;
    leftKeyDown = false;
    rightKeyDown = false;
    spaceKeyDown = false;
}



captureClicSouris = function (event) {
    // calcul des coordonnées de la souris dans le canvas
    if (event.target.id == "cvs") {
        clic.x = event.pageX - event.target.offsetLeft;
        clic.y = event.pageY - event.target.offsetTop;
    }
}




/////////////Partie audio/////////////
var audio, playbtn, mutebtn, volumeslider;

function initAudioPlayer() {
    audio = new Audio();
    audio.src = "files/style/sound/cytus-the-blocks-we-lovedampg.mp3";
    audio.loop = true;
    audio.play();
    //initialisation des variables
    playbtn = document.getElementById("playpausebtn");
    mutebtn = document.getElementById("mutebtn");
    volumeslider = document.getElementById("volumeslider");
    //Fonctions (play/mute)
    playPause = function () {
        if (audio.paused) {
            audio.play();
            playbtn.style.background = "url(files/style/icons/pause.png) no-repeat";
        }
        else {
            audio.pause();
            playbtn.style.background = "url(files/style/icons/play.png) no-repeat";
        }
    }
    ///
    mute = function () {
        if (audio.muted) {
            audio.muted = false;
            mutebtn.style.background = "url(files/style/icons/speaker.png) no-repeat";
        }
        else {
            audio.muted = true;
            mutebtn.style.background = "url(files/style/icons/speaker_muted.png) no-repeat";
        }
    }
    ///
    setvolume = function () {
        audio.volume = volumeslider.value / 100;
    }

    //Ecouteur d'évènements
    playbtn.addEventListener("click", playPause);
    mutebtn.addEventListener("click", mute);
    volumeslider.addEventListener("mousemove", setvolume);

}

window.addEventListener("load", initAudioPlayer);
