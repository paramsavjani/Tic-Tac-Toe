let temp = document.getElementsByClassName("one");
for (let i = 0; i < temp.length; i++) {
    temp[i].addEventListener("click", function () {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    });
}

const sizeInput = document.getElementById("size");
let boardSize = 3;
function gridforfirsttime(board) {
    boardSize = board;
    createBoard(boardSize);
    document.getElementById('modeselect').style.display = 'flex';
    document.getElementById('gridselect').style.display = 'none';
}

document.getElementById('popupContainer').style.display = 'none';
document.getElementById('gameContainer').style.display = 'none';
document.getElementById('oneNameAsking').style.display = 'none';
document.getElementById('nav').style.display = 'none';
document.getElementById('modeselect').style.display = 'none';


document.getElementById("3 X 3").addEventListener("click", () => gridforfirsttime(3));
document.getElementById("5 X 5").addEventListener("click", () => gridforfirsttime(5));
document.getElementById("7 X 7").addEventListener("click", () => gridforfirsttime(7));

function createBoard(size) {
    const container = document.getElementById("gridContainer");
    container.innerHTML = null;
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const containerSize = viewportWidth < 600 ? 90 : 40;
    const gapSize = 15 / size;
    const totalGap = (size - 1) * gapSize;
    const boxSize =
        (containerSize - (totalGap / viewportWidth) * 100) /
        size;
    container.style.gap = `${gapSize}px`;
    container.style.gridTemplateColumns = `repeat(${size}, ${boxSize}vw)`;
    container.style.gridTemplateRows = `repeat(${size}, ${boxSize}vw)`;

    for (let i = 0; i < size * size; i++) {
        const box = document.createElement("div");
        box.classList.add("box");
        const boxtext = document.createElement("div");
        boxtext.classList.add("boxtext");
        boxtext.style.fontSize = `${boxSize / 1.3}vw`; // Changed boardSize to size
        box.appendChild(boxtext);
        container.appendChild(box);
    }
}


function generateWinPatterns(boardSize, winCondition) {
    const winPatterns = [];

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j <= boardSize - winCondition; j++) {
            const rowPattern = [];
            const colPattern = [];
            for (let k = 0; k < winCondition; k++) {
                rowPattern.push(i * boardSize + (j + k));
                colPattern.push((j + k) * boardSize + i);
            }
            winPatterns.push(rowPattern);
            winPatterns.push(colPattern);
        }
    }

    for (let i = 0; i <= boardSize - winCondition; i++) {
        for (let j = 0; j <= boardSize - winCondition; j++) {
            const diagPattern1 = [];
            const diagPattern2 = [];
            for (let k = 0; k < winCondition; k++) {
                diagPattern1.push((i + k) * boardSize + (j + k));
                diagPattern2.push((i + k) * boardSize + (j + winCondition - 1 - k));
            }
            winPatterns.push(diagPattern1);
            winPatterns.push(diagPattern2);
        }
    }
    return winPatterns;
}

let executeFuncLocal = false;
let executeFuncComp = false;

document.getElementById("one").addEventListener("click", () => {
    executeFuncComp = true;
    document.getElementById('mode').innerHTML = "Play with Local"
    startComputer();
})

document.getElementById("two").addEventListener("click", () => {
    executeFuncLocal = true;
    document.getElementById('mode').innerHTML = "Play with Computer"
    startDoubleGame();

})


function resetThedata() {
    let temp = document.getElementById('btn-container');
    temp.replaceWith(temp.cloneNode(true));
    temp = document.getElementById("reset");
    temp.replaceWith(temp.cloneNode(true));
    temp = document.getElementById("clear-score");
    temp.replaceWith(temp.cloneNode(true));
    temp = document.getElementById("rename");
    temp.replaceWith(temp.cloneNode(true));
    const boxes = document.getElementsByClassName("box");

    Array.from(boxes).forEach((element) => {
        element.replaceWith(element.cloneNode(true));
        element.innerHTML = "";
    });
}


document.getElementById('mode').addEventListener("click", () => {
    const gameContainer = document.querySelector('.gameContainer');
    gameContainer.classList.remove('fade-in');
    void gameContainer.offsetWidth;
    gameContainer.classList.add('fade-in');

    if (executeFuncComp) {
        executeFuncComp = false;
        executeFuncLocal = true;
        document.getElementById("info").style.display = "block";
        resetThedata();
        startDoubleGame();
        document.getElementById('mode').innerHTML = "Play with Computer";
    } else {
        executeFuncLocal = false;
        executeFuncComp = true;
        resetThedata();
        startComputer();
        document.getElementById('mode').innerHTML = "Play with Local";
    }
});



function changegrid() {

    const gameContainer = document.querySelector('.gameContainer');
    gameContainer.classList.remove('fade-in');
    void gameContainer.offsetWidth;
    gameContainer.classList.add('fade-in');
    createBoard(boardSize);
    document.getElementById('gridselect').style.display = 'none';


    if (executeFuncLocal) {
        executeFuncComp = false;
        executeFuncLocal = true;
        document.getElementById("info").style.display = "block";
        resetThedata();
        startDoubleGame();
        document.getElementById('mode').innerHTML = "Play with Computer";
    } else {
        executeFuncLocal = false;
        executeFuncComp = true;
        resetThedata();
        startComputer();
        document.getElementById('mode').innerHTML = "Play with Local";
    }
}



document.getElementById("grid").addEventListener("click", function () {
    document.getElementById('gridselect').style.display = 'flex';
    let oldElement = document.getElementById("3 X 3");
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    oldElement = document.getElementById("5 X 5");
    newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    oldElement = document.getElementById("7 X 7");
    newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    document.getElementById('3 X 3').addEventListener("click", function () {
        boardSize = 3;
        changegrid();
    })
    document.getElementById('5 X 5').addEventListener("click", function () {
        boardSize = 5;
        changegrid();
    })
    document.getElementById('7 X 7').addEventListener("click", function () {
        boardSize = 7;
        changegrid();
    })
})

const volumeIcon = document.getElementById('volume');
let isMuted = false;

volumeIcon.addEventListener('click', function () {
    if (isMuted) {
        volumeIcon.src = "/static/volume.png";
        volumeIcon.classList.remove('clicked');
        isMuted = false;
    } else {
        volumeIcon.src = "/static/mute.png";
        volumeIcon.classList.add('clicked');
        isMuted = true;
    }
});

// Initialize AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let turn0Buffer, turnXBuffer, gameoverBuffer;

// Preload the audio files
async function preloadAudio(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data));
}

Promise.all([
    preloadAudio('/static/turn_0.mp3').then(buffer => turn0Buffer = buffer),
    preloadAudio('/static/turn_x.mp3').then(buffer => turnXBuffer = buffer),
    preloadAudio('/static/gameover.mp3').then(buffer => gameoverBuffer = buffer)
]).catch(e => console.error('Error loading audio files', e));

function playAudio(buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}

function play_turn_0() {
    if (turn0Buffer) {
        playAudio(turn0Buffer);
    }
}

function play_turn_x() {
    if (turnXBuffer) {
        playAudio(turnXBuffer);
    }
}

function play_gameover() {
    if (gameoverBuffer) {
        playAudio(gameoverBuffer);
    }
}



function startDoubleGame() {



    const player1Name = localStorage.getItem(`player1Name`);
    const player2Name = localStorage.getItem(`player2Name`);
    loadGameState();

    if (player1Name && player2Name) {
        document.getElementById('player1Name').value = player1Name;
        document.getElementById('player2Name').value = player2Name;
        document.getElementById('popupContainer').style.display = 'none';
        document.querySelector('.score.ply1 p:nth-child(1)').innerText = `${player1Name} (X)`;
        document.querySelector('.score.ply2 p:nth-child(1)').innerText = `${player2Name} (O)`;
        document.getElementById('gameContainer').style.display = 'flex';
        document.getElementById('nav').style.display = 'flex';
    } else {
        document.getElementById('popupContainer').style.display = 'flex';
    }

    document.getElementById('modeselect').style.display = 'none';
    document.getElementById('btn-container').addEventListener("click", startGame);

    function startGame() {
        const player1Name = document.getElementById('player1Name').value;
        const player2Name = document.getElementById('player2Name').value;
        document.getElementById('modeselect').style.display = 'none';

        if (player1Name && player2Name) {
            localStorage.setItem('player1Name', player1Name);
            localStorage.setItem('player2Name', player2Name);
            document.getElementById('popupContainer').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'flex';
            document.getElementById('nav').style.display = 'flex';
            updateTurnInfo(player1Name, player2Name);
        } else {
            alert('Please enter names for both players.');
        }
    }

    function rename() {
        document.getElementById('popupContainer').style.display = "flex";
        document.getElementById('btn-container').addEventListener('click', function () {
            startGame(); // Reuse the startGame function to save and update names
        });
    }

    function updateTurnInfo(player1Name, player2Name) {
        document.querySelector('.score.ply1 p:nth-child(1)').innerText = `${player1Name} (X)`;
        document.querySelector('.score.ply2 p:nth-child(1)').innerText = `${player2Name} (O)`;
        obj["X"] = player1Name;
        obj["O"] = player2Name;

        if (moveCount != 0)
            document.querySelector(".info").innerText = `Turn for ${obj[turn]}`;
        else
            document.querySelector(".info").innerText = `Start from ${obj[turn]}`;
    }

    let leftname = localStorage.getItem(`player1Name`);
    let rightname = localStorage.getItem(`player2Name`);

    const obj = {
        "X": leftname,
        "O": rightname,
    }

    let turn = localStorage.getItem(`turn${boardSize}`) ? localStorage.getItem(`turn${boardSize}`) : null;

    if (turn == null) {
        let x = Math.random();
        turn = x < 0.5 ? "X" : "O";
    }

    let isGameOver = false;
    let moveCount = localStorage.getItem(`move${boardSize}`) ? parseInt(localStorage.getItem(`move${boardSize}`)) : 0;
    let player1Score = localStorage.getItem(`ply1`) ? parseInt(localStorage.getItem(`ply1`)) : 0;
    let player2Score = localStorage.getItem(`ply2`) ? parseInt(localStorage.getItem(`ply2`)) : 0;
    let tieScore = localStorage.getItem(`tie`) ? parseInt(localStorage.getItem(`tie`)) : 0;

    const imgBox = document.querySelectorAll(".imgbox");

    if (moveCount != 0)
        document.querySelector(".info").innerText = `Turn for ${obj[turn]}`;
    else
        document.querySelector(".info").innerText = `Start from ${obj[turn]}`;


    function loadGameState() {
        const savedState = JSON.parse(localStorage.getItem(`gameState${boardSize}`));
        if (savedState) {
            const boxTexts = document.querySelectorAll(".boxtext");
            boxTexts.forEach((box, index) => {
                box.innerText = savedState[index];
            });
        }
    }
    loadGameState(); // Load the game state when the page loads

    function saveGameState() {
        const boxTexts = document.querySelectorAll(".boxtext");
        const gameState = Array.from(boxTexts).map(box => box.innerText);
        localStorage.setItem(`gameState${boardSize}`, JSON.stringify(gameState));
    }

    function updatePlayerScore(newScore) {
        document.querySelector('.score.ply1 p:nth-child(2)').innerText = newScore;
    }

    function updateTieScore(newScore) {
        document.querySelector('.score.tie p:nth-child(2)').innerText = newScore;
    }

    function updatePlayer2Score(newScore) {
        document.querySelector('.score.ply2 p:nth-child(2)').innerText = newScore;
    }


    updatePlayerScore(player1Score);
    updatePlayer2Score(player2Score);
    updateTieScore(tieScore);

    const changeTurn = () => turn === "X" ? "O" : "X";

    const resetGame = () => {
        localStorage.removeItem(`gameState${boardSize}`);
        moveCount = 0;
        localStorage.setItem(`move${boardSize}`, '0');
        const boxTexts = document.querySelectorAll(".boxtext");
        boxTexts.forEach((element) => {
            element.innerHTML = "";
        });
        let x = Math.random();
        turn = x < 0.5 ? "X" : "O";
        localStorage.setItem(`turn${boardSize}`, `${turn}`);

        isGameOver = false;
        imgBox[0].style.display = "none";
        imgBox[1].style.display = "none";
        document.querySelector(".info").innerText = `Start from ${obj[turn]}`;
    };

    const checkDraw = () => {
        if (moveCount === (boardSize * boardSize)) {
            const boxTexts = document.getElementsByClassName("boxtext");
            document.getElementById("info").innerText = "Match tied";

            let blinkInterval = setInterval(() => {
                Array.from(boxTexts).forEach(e => {
                    e.classList.toggle("blinking");
                });
            }, 200);

            updateTieScore(++tieScore);
            localStorage.setItem("tie", `${tieScore}`);

            setTimeout(() => {
                clearInterval(blinkInterval);
                Array.from(boxTexts).forEach(e => {
                    e.classList.remove("blinking");
                });
                resetGame();
            }, 1200);

            return true;
        } else {
            return false;
        }
    };


    const checkWin = (boardSize) => {
        const boxTexts = document.getElementsByClassName("boxtext");
        const winCondition = boardSize === 3 ? 3 : 4;
        const winPatterns = generateWinPatterns(boardSize, winCondition);

        winPatterns.forEach((pattern) => {
            let isWin = true;
            for (let i = 1; i < pattern.length; i++) {
                if (boxTexts[pattern[i]].innerText !== boxTexts[pattern[0]].innerText || boxTexts[pattern[0]].innerText === "") {
                    isWin = false;
                    break;
                }
            }
            if (isWin) {
                let blinkInterval = setInterval(() => {
                    pattern.forEach((index) => {
                        boxTexts[index].classList.toggle("blinking");
                    });
                }, 200);

                const winnerSymbol = boxTexts[pattern[0]].innerText;
                if (winnerSymbol === "X") {
                    imgBox[0].style.display = "block";
                    updatePlayerScore(++player1Score);
                    localStorage.setItem("ply1", `${player1Score}`);
                } else {
                    updatePlayer2Score(++player2Score);
                    localStorage.setItem("ply2", `${player2Score}`);
                    imgBox[1].style.display = "block";
                }
                document.querySelector(".info").innerText = `${obj[winnerSymbol]} Won`;
                isGameOver = true;
                if (!isMuted) {
                    play_gameover();
                }

                setTimeout(() => {
                    clearInterval(blinkInterval);
                    pattern.forEach((index) => {
                        boxTexts[index].classList.remove("blinking");
                    });
                    resetGame();
                }, 1800);
            }
        });
    };


    const boxes = document.getElementsByClassName("box");

    Array.from(boxes).forEach((element) => {
        const boxText = element.querySelector(".boxtext");

        element.addEventListener("mouseenter", () => {
            if (boxText.innerText === "") {
                element.classList.add("hover");
            }
        });

        element.addEventListener("mouseleave", () => {
            element.classList.remove("hover");
        });

        element.addEventListener("click", () => {
            if (boxText.innerText === "" && !isGameOver) {
                element.classList.toggle("hover");
                boxText.innerText = turn;
                saveGameState();
                if (turn == "X" && (!isMuted))
                    play_turn_x();
                else if (!isMuted)
                    play_turn_0();
                turn = changeTurn();
                moveCount++;
                localStorage.setItem(`move${boardSize}`, '0');
                checkWin(boardSize);
                if (!isGameOver) {
                    if (!checkDraw()) {
                        document.querySelector(".info").innerText = `Turn for ${obj[turn]}`;
                        localStorage.setItem(`turn${boardSize}`, `${turn}`);
                    }
                }
            }
        });
    });



    function resetScore() {
        player1Score = 0;
        player2Score = 0;
        tieScore = 0;
        updatePlayerScore(player1Score);
        updatePlayer2Score(player2Score);
        updateTieScore(tieScore);
        localStorage.setItem("ply1", '0');
        localStorage.setItem("ply2", '0');
        localStorage.setItem("tie", '0');
    }

    document.getElementById("reset").addEventListener("click", resetGame);
    document.getElementById("clear-score").addEventListener("click", resetScore);
    document.getElementById("rename").addEventListener("click", rename);

}




function startComputer() {

    let playerName = null;

    updateNames();


    document.getElementById('info').style.display = 'none';
    document.getElementById('modeselect').style.display = 'none';
    document.getElementById('btn-container-for-computer').addEventListener("click", startGame);
    document.querySelector('.score.ply2 p:nth-child(1)').innerText = `Computer (O)`;

    function updateNames() {
        playerName = localStorage.getItem(`playerName`);
        loadGameState();


        if (playerName) {
            document.getElementById('playerName').value = playerName;
            document.getElementById('oneNameAsking').style.display = 'none';
            document.querySelector('.score.ply1 p:nth-child(1)').innerText = `${playerName} (X)`;
            document.querySelector('.score.ply2 p:nth-child(1)').innerText = `Computer (O)`;
            document.getElementById('gameContainer').style.display = 'flex';
            document.getElementById('nav').style.display = 'flex';
        } else {
            document.getElementById('oneNameAsking').style.display = 'flex';
        }
    }

    function startGame() {
        playerName = document.getElementById('playerName').value;

        if (playerName) {
            localStorage.setItem('playerName', playerName);
            document.getElementById('oneNameAsking').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'flex';
            document.getElementById('nav').style.display = 'flex';
            updateTurnInfo(playerName);
        } else {
            alert('Please enter names for both players.');
        }
    }

    function rename() {
        document.getElementById('oneNameAsking').style.display = "flex";
        document.getElementById('btn-container-for-computer').innerText = "Save Name"
        document.getElementById('btn-container-for-computer').addEventListener('click', function () {
            startGame(); // Reuse the startGame function to save and update names
        });
    }

    function updateTurnInfo(playerName) {
        document.querySelector('.score.ply1 p:nth-child(1)').innerText = `${playerName} (X)`;
    }

    let moveWithCoputer = localStorage.getItem(`moveWithCoputer${boardSize}`) ? parseInt(localStorage.getItem(`moveWithCoputer${boardSize}`)) : 0;



    let isGameOver = false;
    let playerScore = localStorage.getItem(`ply`) ? parseInt(localStorage.getItem(`ply`)) : 0;
    let computerScore = localStorage.getItem(`computerScore`) ? parseInt(localStorage.getItem(`computerScore`)) : 0;
    let tieScore = localStorage.getItem(`tiecomputer`) ? parseInt(localStorage.getItem(`tiecomputer`)) : 0;
    const imgBox = document.querySelectorAll(".imgbox");

    function loadGameState() {
        const savedState = JSON.parse(localStorage.getItem(`gameStatecompter${boardSize}`));
        if (savedState) {
            const boxTexts = document.querySelectorAll(".boxtext");
            boxTexts.forEach((box, index) => {
                box.innerText = savedState[index];
            });
        }
    }
    loadGameState(); // Load the game state when the page loads


    function saveGameState() {
        const boxTexts = document.querySelectorAll(".boxtext");
        const gameState = Array.from(boxTexts).map(box => box.innerText);
        localStorage.setItem(`gameStatecompter${boardSize}`, JSON.stringify(gameState));
    }


    function updatePlayerScore(newScore) {
        document.querySelector('.score.ply1 p:nth-child(2)').innerText = newScore;
    }

    function updateTieScore(newScore) {
        document.querySelector('.score.tie p:nth-child(2)').innerText = newScore;
    }

    function updatePlayer2Score(newScore) {
        document.querySelector('.score.ply2 p:nth-child(2)').innerText = newScore;
    }

    updatePlayerScore(playerScore);
    updatePlayer2Score(computerScore);
    updateTieScore(tieScore);

    function resetGame() {
        localStorage.removeItem(`gameStatecompter${boardSize}`);
        document.getElementById("info").style.display = "none";
        moveWithCoputer = 0;
        localStorage.removeItem(`moveWithCoputer${boardSize}`);
        const boxTexts = document.querySelectorAll(".boxtext");
        boxTexts.forEach((element) => {
            element.innerHTML = "";
        });
        let x = Math.random();
        let turn = x < 0.6 ? "X" : "O";
        if (turn == "O") {
            let y = Math.floor(Math.random() * boardSize * boardSize);
            boxTexts.forEach((element, ind) => {
                if (y == ind) {
                    element.innerHTML = "O"
                }
            });
            moveWithCoputer++;
            localStorage.setItem(`moveWithCoputer${boardSize}`, `${moveWithCoputer}`);
        }
        saveGameState();
        if (!isMuted) {
            play_gameover();
        }
        isGameOver = false;
        imgBox[0].style.display = "none";
        imgBox[1].style.display = "none";
    };

    function checkDraw() {
        if (moveWithCoputer === (boardSize * boardSize)) {
            const boxTexts = document.getElementsByClassName("boxtext");
            document.getElementById("info").style.display = "block";
            document.getElementById("info").innerText = "Match tied";

            let blinkInterval = setInterval(() => {
                Array.from(boxTexts).forEach(e => {
                    e.classList.toggle("blinking");
                });
            }, 150);

            updateTieScore(++tieScore);
            localStorage.setItem("tiecomputer", `${tieScore}`);

            setTimeout(() => {
                clearInterval(blinkInterval);
                Array.from(boxTexts).forEach(e => {
                    e.classList.remove("blinking");
                });
                resetGame();
            }, 800);
            if (!isMuted) {
                play_gameover();
            }
            return true;
        } else {
            return false;
        }
    };





    function generateWinPatterns(boardSize, winCondition) {
        let winPatterns = [];

        // Rows
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j <= boardSize - winCondition; j++) {
                let pattern = [];
                for (let k = 0; k < winCondition; k++) {
                    pattern.push(i * boardSize + j + k);
                }
                winPatterns.push(pattern);
            }
        }

        // Columns
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j <= boardSize - winCondition; j++) {
                let pattern = [];
                for (let k = 0; k < winCondition; k++) {
                    pattern.push((j + k) * boardSize + i);
                }
                winPatterns.push(pattern);
            }
        }

        // Diagonals
        for (let i = 0; i <= boardSize - winCondition; i++) {
            for (let j = 0; j <= boardSize - winCondition; j++) {
                let pattern = [];
                for (let k = 0; k < winCondition; k++) {
                    pattern.push((i + k) * boardSize + (j + k));
                }
                winPatterns.push(pattern);
            }
        }

        // Anti-diagonals
        for (let i = 0; i <= boardSize - winCondition; i++) {
            for (let j = winCondition - 1; j < boardSize; j++) {
                let pattern = [];
                for (let k = 0; k < winCondition; k++) {
                    pattern.push((i + k) * boardSize + (j - k));
                }
                winPatterns.push(pattern);
            }
        }

        return winPatterns;
    }



    const PLAYER = 'X';
    const COMPUTER = 'O';



    // Function to check if a player has won
    function checkWinner(board, player, winPatterns) {
        for (let combo of winPatterns) {
            if (combo.every(index => board[index] === player)) {
                return true;
            }
        }
        return false;
    }

    // Function to check if the board is full
    function isBoardFull(board) {
        return board.every(cell => cell === PLAYER || cell === COMPUTER);
    }

    function minimax(board, depth, alpha, beta, isMaximizing, winPatterns) {
        if (checkWinner(board, COMPUTER, winPatterns))
            return 10 - depth;
        if (checkWinner(board, PLAYER, winPatterns)) return depth - 10;
        if (isBoardFull(board)) return 0;

        if (depth > 6) return 0; // Prevent infinite recursion

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = COMPUTER;
                    let eval = minimax(
                        board,
                        depth + 1,
                        alpha,
                        beta,
                        false,
                        winPatterns
                    );
                    board[i] = null;
                    maxEval = Math.max(maxEval, eval);
                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) break; // Beta cut-off
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = PLAYER;
                    let eval = minimax(
                        board,
                        depth + 1,
                        alpha,
                        beta,
                        true,
                        winPatterns
                    );
                    board[i] = null;
                    minEval = Math.min(minEval, eval);
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) break; // Alpha cut-off
                }
            }
            return minEval;
        }
    }

    // Function to find the best move for the computer
    function findBestMove(board, winPatterns) {
        let bestMove = -1;
        let bestValue = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = COMPUTER;
                let moveValue = minimax(board, 3, -Infinity, Infinity, false, winPatterns);
                board[i] = null;
                if (moveValue > bestValue) {
                    bestValue = moveValue;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    function computerMove() {
        moveWithCoputer++;
        localStorage.setItem(`moveWithCoputer${boardSize}`, `${moveWithCoputer}`);
        const winCondition = boardSize === 3 ? 3 : 4;
        let board = [];
        const boxes = document.getElementsByClassName("box");
        Array.from(boxes).forEach((element) => {
            const boxText = element.querySelector(".boxtext");
            if (boxText.innerText !== '') {
                board.push(boxText.innerText);
            } else {
                board.push(null);
            }
        });

        const winPatterns = generateWinPatterns(boardSize, winCondition);
        let bestMove = findBestMove(board, winPatterns);

        Array.from(boxes).forEach((element, index) => {
            const boxText = element.querySelector(".boxtext");
            if (bestMove === index) {
                element.classList.add("hover");
                boxText.innerHTML = COMPUTER;
                setTimeout(() => {
                    element.classList.remove("hover");
                    checkWin(boardSize);
                    if (!isGameOver) {
                        checkDraw();
                    }
                    saveGameState();
                }, 200);
            }
        });
    }


    // Function to check if there is a winner
    const checkWin = (boardSize) => {
        const boxTexts = document.getElementsByClassName("boxtext");
        const winCondition = boardSize === 3 ? 3 : 4;
        const winPatterns = generateWinPatterns(boardSize, winCondition);

        winPatterns.forEach((pattern) => {
            let isWin = true;
            for (let i = 1; i < pattern.length; i++) {
                if (boxTexts[pattern[i]].innerText !== boxTexts[pattern[0]].innerText || boxTexts[pattern[0]].innerText === "") {
                    isWin = false;
                    break;
                }
            }
            if (isWin) {
                let blinkInterval = setInterval(() => {
                    pattern.forEach((index) => {
                        boxTexts[index].classList.toggle("blinking");
                    });
                }, 200);

                const winnerSymbol = boxTexts[pattern[0]].innerText;
                if (winnerSymbol === "X") {
                    imgBox[0].style.display = "block";
                    updatePlayerScore(++playerScore);
                    localStorage.setItem("ply", `${playerScore}`);
                } else {
                    updatePlayer2Score(++computerScore);
                    localStorage.setItem("", `${computerScore}`);
                    imgBox[1].style.display = "block";
                }
                document.querySelector(".info").innerText = `Computer Won`;
                isGameOver = true;
                if (!isMuted) {
                    play_gameover();
                }

                setTimeout(() => {
                    clearInterval(blinkInterval);
                    pattern.forEach((index) => {
                        boxTexts[index].classList.remove("blinking");
                    });
                    resetGame();
                }, 1800);
            }
        });
    };



    const boxes = document.getElementsByClassName("box");

    Array.from(boxes).forEach((element) => {
        const boxText = element.querySelector(".boxtext");

        element.addEventListener("mouseenter", () => {
            if (boxText.innerText === "") {
                element.classList.add("hover");
            }
        });

        element.addEventListener("mouseleave", () => {
            element.classList.remove("hover");
        });

        element.addEventListener("click", () => {
            if (boxText.innerText === "" && !isGameOver) {
                element.classList.toggle("hover");
                boxText.innerText = "X";
                if (!isMuted) {
                    play_turn_x();
                }
                saveGameState();
                moveWithCoputer++;
                localStorage.setItem(`moveWithCoputer${boardSize}`, `${moveWithCoputer}`);
                checkWin(boardSize);
                if (!isGameOver) {
                    if (!checkDraw()) {
                        setTimeout(() => computerMove(), 300);
                    }
                }
            }
        });
    });


    function resetScore() {
        playerScore = 0;
        computerScore = 0;
        tieScore = 0;
        updatePlayerScore(playerScore);
        updatePlayer2Score(computerScore);
        updateTieScore(tieScore);
        localStorage.setItem("ply", '0');
        localStorage.setItem("computerScore", '0');
        localStorage.setItem("tiecomputer", '0');
    }

    document.getElementById("reset").addEventListener("click", resetGame);
    document.getElementById("clear-score").addEventListener("click", resetScore);
    document.getElementById("rename").addEventListener("click", rename);

}