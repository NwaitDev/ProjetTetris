var INIT_LEVEL = 0;
/**
 * Constructeur du type game
 * @param {number} INIT_LEVEL level initial au début de la partie
 */
var game = function (INIT_LEVEL) {
    this.level = INIT_LEVEL;
    this.score = 0;
    this.lines= 0;
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
        self.level = Math.floor(self.lines/10);
    }
}

