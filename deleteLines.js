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
    
    if(!res.includes(tetromino.block4.y))
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
 * Action de descente des lignes de la grille de jeu après la suppression d'une lignes
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
        for (let x=0; j<9; j++){
            grid[x][y] = 0;
        }
        for (let k=y; k>0; k--){
            lineFall(k,grid);
        }
    }
}

//ordonnée des lignes complétées :
var lines = new Array();
lines = completedLines(tetromino, grid);
if(lines.length !=0){
    deleteLines(lines,grid);
}