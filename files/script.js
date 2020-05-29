var context = null;



/**
 * Coordonées d'un clic dans le canva
 */

var clic = { x: 0, y: 0 };

/**
 * Variable contenant les informations et fonctions utliles au jeu
 */
var game;

/** 
 * Largeur d'une case de la grille
 */
var tileWidth;

/**
 * Hauteur d'une case de la grille
 */
var tileHeight;

/**
 * Hauteur de la fenêtre des scores
 */
var scoreWindowWidth = 100;
/**
 * variable utilisée pour mesurer le temps écoulé entre deux récursions de la boucle de jeu
 */
var lastTimeUpdate = Date.now();

/**
 * variable utilisée pour mesurer le temps écoulé entre deux déplacements de tetromino
 */
var lastMoveTime = Date.now();

//état d'appui des flèches directionnelles :

/**
 * état d'appui de la flèche du bas
 */
var downKeyDown = false;
/**
 * état d'appui de la flèche du haut
 */
var upKeyDown = false;
/**
 * état d'appui de la flèche gauche
 */
var leftKeyDown = false;
/**
 * état d'appui de la flèche droite
 */
var rightKeyDown = false;
/**
 * état d'appui de la barre espace
 */
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
     * @returns {Tetromino} copie du tetromino
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

    /**
     * variable definissant si la partie a commencé 
     */
    this.startGame = false;
    /**
     * niveau en cours
     */
    this.level = 0;
    /**
     * niveau de départ
     */
    this.startLevel = 0;
    /**
     * score de la partie en cours
     */
    this.score = 0;
    /**
     * nombre de lignes complétées
     */
    this.lines = 0;
    /**
     * tableau des lignes complétées lors de la pose d'un tetromino
     */
    this.completedLines = new Array();
    /**
     * couleur du prochain tetromino
     */
    this.nextColor = Math.ceil(Math.random() * 7);
    
    /**
     * grille de jeu
     */
    this.grid =[];
    for (let i = 0; i < 10; i++) {
        this.grid[i] = new Array();
        for (let j = 0; j < 20; j++) {
            this.grid[i][j] = 0;
        }
    }

    /**
     * fonction de mise à jour de la prochaine couleur
     * @returns {number} valeur de la prochaine couleur
     */
    this.updateColor = function () {
        self.nextColor = Math.ceil(Math.random() * 7);
        return self.nextColor;
    }
    
    /**
     * tetromino en cours de placement
     */
    this.tetromino = spawnTetromino(self.nextColor);
    
    /**
     * prochain tetromino (celui affiché dans la fenêtre de prévisualisation)
     */
    this.nextTetro = spawnTetromino(self.updateColor());

    /**
     * mise à jour du tetromino en cours de placement et du prochain tetromino
     */
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
     * @returns {number} intervalle de temps
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
 * fonction de lancement d'une nouvelle partie
 */
throwGame = function(){
    resetKeyDown();
    game = new Game();
    runMenu(); 
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
    throwGame();
}

/**
 * boucle du menu
 */
runMenu = function runMenu() {
    printMenu();
    updateMenu();
    if (!game.startGame) {
        requestAnimationFrame(runMenu);
    } else {
        runGame();
    }
}

/**
 * affichage du menu
 */
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

/**
 * mise à jour du menu
 */
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
/**
 * fonction retournant la couleur pour afficher niveau dans le menu
 * @returns {String} code hexadécimal de la couleur
 */
levelColor = function (i) {
    if (i == game.level) {
        return "#FFF";
    } else {
        return "#00F";
    }
}


/**
 * fonction de lancement de la procédure de fin de partie
 */
tetronul = function (){
    let i = 0;
    let confirm = document.getElementById("myConfirm");
    successFunction(i, confirm);
}

/**
 * fonction d'affichage des différentes boîtes de dialogue à la fin de la partie et lancement d'une nouvelle partie
 * @param {number} i nombre d'appel de la fonction
 * @param {any} confirm J'ai pas bien compris à quoi ça sert mais si on le fait pas ça marche pas... alors je le fais.
 */
successFunction = function successFunction(i,confirm){

    let text = "";
    switch(i){
        case 0:
            text = "GAMEOVER ! Score : "+game.score+" Rejouer ?";
            i++;
        break;
        case 1:
            text = "Tu penses vraiment pouvoir faire mieux que "+game.score+" ?";
            i++;
        break;
        case 2:
            text = "Pour de vrai ?";
            i++;
        break;
        case 3:
            text = "VRAIMENT ?";
            i++;
        break;
        case 4 :
            text = "Non parce que sinon tu peux faire autre chose... tu veux vraiment rejouer ?";
            i++;
        break;
        case 5 :
            text = "Perso, je t'ai vu jouer : c'était pas fou fou... tu veux vraiment VRAIMENT rejouer ?";
            i++;
        break;
        case 6 : 
            text = "Clique encore une fois sur \"Yes!\" et je t'empêche de jouer...";
            i++;
        break;
        case 10 : 
            text = "Tu sais que tu te fatigueras avant moi !";
            i++;
        break;
        case 20 :
            text = "C'est bon, t'as gagné...";
        default : 
            text = "Clique sur \"No...\"";
            i++;
    }
    $(confirm).simpleConfirm({
        message: text,
        success: function(){
            if(i<20){
                successFunction(i, confirm);
            }else{
                throwGame();
            }},
        cancel: function(){throwGame()}
    });
}

/**
 * Boucle de jeu
 */
runGame = function runGame() {
    update(Date.now());
    printStuff();
    if (!game.gameOver()) {
        requestAnimationFrame(runGame);
    } else {
        tetronul();
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

    //affichage du quadrillage
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
                setTimeout(game.deleteLines, fallTime / 2);
                setTimeout(game.updateGame, fallTime / 2); 
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
                setTimeout(game.deleteLines, fallTime / 2);
                setTimeout(game.updateGame, fallTime / 2); 
            }
            resetKeyDown();
            game.updateTetromino();
        }
        lastTimeUpdate = d;
    }
}












/**
 * mise à jour de l'état d'appui des boutons lors d'un appui
 */
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
/**
 * mise à jour de l'état d'appui des boutons lors du relâchement
 */
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

/**
 * Mise à jour de la position d'un clic de souris
 */
captureClicSouris = function (event) {
    // calcul des coordonnées de la souris dans le canvas
    if (event.target.id == "cvs") {
        clic.x = event.pageX - event.target.offsetLeft-7; //oui... C'est du bidouillage j'avoue
        clic.y = event.pageY - event.target.offsetTop-15;
    }
}



/////////////Partie audio/////////////
var audio, playbtn, mutebtn, volumeslider;

/**
 * fonction d'initialisation de la lecture de la musique
 */
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