const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const statusText = document.querySelector('.status');
const restartButton = document.querySelector('.restart');
let isOTurn = false;

// Create audio element for click sound
const clickSound = new Audio('./sounds/cell.wav');
const winSound = new Audio('./sounds/win.wav');
const drawSound = new Audio('./sounds/draw.wav');

startGame();

function startGame() {
    isOTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    statusText.textContent = "Player X's Turn";
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = isOTurn ? O_CLASS : X_CLASS;

    // Play sound
    clickSound.play();

    // Place Mark
    placeMark(cell, currentClass);

    // Check For Win
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        // Switch Turns
        swapTurns();
        setBoardHoverClass();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    isOTurn = !isOTurn;
    statusText.textContent = `Player ${isOTurn ? "O" : "X"}'s Turn`;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    board.classList.add(isOTurn ? O_CLASS : X_CLASS);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    if (draw) {
        statusText.textContent = "Draw!";
        drawSound.play();
    } else {
        statusText.textContent = `Player ${isOTurn ? "O" : "X"} Wins!`;
        winSound.play();
    }
    
    // Remove click events from all cells after game ends
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

restartButton.addEventListener('click', startGame);