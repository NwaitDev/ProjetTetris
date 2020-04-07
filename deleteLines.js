/**
 * Fonction vérifiant si une ligne de la grille est complétée
 * @param {tetromino qui s'est fixé sur la grille} tetromino
 * @param {grille de jeu} grid
 */
isCompleted = function isCompleted(tetromino, grid){
    var isCompleted = true;
    var res = new Array ();
    var i = 0;
    var j= 0;
    while (isCompleted && i<9){
        if(grid [tetromino.block1.y][i] !=0){
            i++;
        }else{
            isCompleted = false;
        }
    }
    if(isCompleted){
        res[j] = tetromino.block1.y;
        j++;
    }

    i = 0; 
    isCompleted = true;
    while (isCompleted && i<9){
        if(grid [tetromino.block2.y][i] !=0){
            i++;
        }else{
            isCompleted = false;
        }
    }
    if(isCompleted){
        res[j] = tetromino.block2.y;
        j++
    }

    i = 0; 
    isCompleted = true;
    while (isCompleted && i<9){
        if(grid [tetromino.block3.y][i] !=0){
            i++;
        }else{
            isCompleted = false;
        }
    }
    if(isCompleted){
        res[j] = tetromino.block3.y;
        j++;
    }
    
    i = 0; 
    isCompleted = true;
    while (isCompleted && i<9){
        if(grid [tetromino.block4.y][i] !=0){
            i++;
        }else{
            isCompleted = false;
        }
    }
    if(isCompleted){
        res[j] = tetromino.block4.y;
        j++;
    }
    return res;
}

/**
 * Action de suppression des lignes complétées
 * @param {indices des lignes à supprimer} lines
 * @param {grille de jeu} grid
 */
deleteLines = function deleteLines(lines, grid){
    for (var i=0; i<lines.length; i++){
        for (var j=0; j<9; j++){
            grid[j][lines[i]] = 0;
        }
    }
}