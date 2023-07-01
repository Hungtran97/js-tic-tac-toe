import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementAtIdx, getCellElementList, getCurrentTurnElement, getGameStatusElement, getReplayGameElement } from "./selectors.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");
let gameStatus = GAME_STATUS.PLAYING;
function toggleTurn () {
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE :  TURN.CROSS;
    
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS)
        currentTurnElement.classList.add(currentTurn)
    }
    
}

function updateGameStatus (status) {
    if (status) {
        gameStatus = status;
        getGameStatusElement().textContent = status;
    };
}
function highlightWinCell (winPositions) {
    if (Array.isArray(winPositions)) {
        for (const winPosition of winPositions) {
            const winCell = getCellElementAtIdx(winPosition);
            winCell.classList.add('win')
        }
    }

}
function showReplayButton () {
    getReplayGameElement().classList.add('show');

}

function handelCellClick (cell, index) {
    
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS)
    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
    if (isClicked || isEndGame) return;
    cell.classList.add(currentTurn)

    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    toggleTurn();

    const game = checkGameStatus(cellValues);

    switch (game.status) {
        case GAME_STATUS.ENDED: {
            updateGameStatus(game.status);
            showReplayButton();
            break;
        }
        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN: {
        updateGameStatus(game.status);
        highlightWinCell(game.winPositions);
        showReplayButton();
        break;
        }
        default:
            //Playing

    }
}

function initCellElementList () {
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell, index) => {
        cell.addEventListener('click', () => handelCellClick(cell, index))        
    });
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
(() =>{
    // bind click event for all li element
    initCellElementList();
    // bind click event for replay element

})()