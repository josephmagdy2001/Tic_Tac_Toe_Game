const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');

let boardState = Array(9).fill(null);
const humanPlayer = 'X';
const computerPlayer = 'O';
let gameActive = true;

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => makeMove(index), { once: true });
});

restartButton.addEventListener('click', restartGame);

function makeMove(index) {
    if (gameActive && !boardState[index]) {
        boardState[index] = humanPlayer;
        cells[index].textContent = humanPlayer;
        if (checkWinner(boardState, humanPlayer)) {
            endGame('You win!');
        } else if (isDraw()) {
            endGame('It\'s a draw!');
        } else {
            computerMove();
        }
    }
}

function computerMove() {
    if (!gameActive) return;

    const bestMove = minimax(boardState, computerPlayer).index;
    boardState[bestMove] = computerPlayer;
    cells[bestMove].textContent = computerPlayer;
    if (checkWinner(boardState, computerPlayer)) {
        endGame('Computer wins!');
    } else if (isDraw()) {
        endGame('It\'s a draw!');
    }
}

function checkWinner(board, player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

function isDraw() {
    return boardState.every(cell => cell);
}

function endGame(result) {
    message.textContent = result;
    gameActive = false; // Disable further moves
    cells.forEach(cell => cell.removeEventListener('click', makeMove));
}

function restartGame() {
    boardState.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', () => makeMove(parseInt(cell.getAttribute('data-index'))), { once: true });
    });
    message.textContent = '';
    gameActive = true; // Re-enable the game
}

function minimax(newBoard, player) {
    const availableSpots = newBoard.reduce((acc, el, i) => el === null ? acc.concat(i) : acc, []);

    if (checkWinner(newBoard, humanPlayer)) {
        return { score: -10 };
    } else if (checkWinner(newBoard, computerPlayer)) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    availableSpots.forEach(spot => {
        const move = {};
        move.index = spot;
        newBoard[spot] = player;

        if (player === computerPlayer) {
            const result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, computerPlayer);
            move.score = result.score;
        }

        newBoard[spot] = null;
        moves.push(move);
    });

    let bestMove;
    if (player === computerPlayer) {
        let bestScore = -Infinity;
        moves.forEach((move, i) => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((move, i) => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        });
    }

    return moves[bestMove];
}
