document.getElementById('popupContainer').style.display = 'none';
document.getElementById('gameContainer').style.display = 'none';
document.getElementById('oneNameAsking').style.display = 'none';
document.getElementById('nav').style.display = 'none';

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
document.getElementById('mode').addEventListener("click", () => {
    const gameContainer = document.querySelector('.gameContainer');
    gameContainer.classList.remove('fade-in');
    void gameContainer.offsetWidth;
    gameContainer.classList.add('fade-in');

    if (executeFuncComp) {
        executeFuncComp = false;
        executeFuncLocal = true;
        document.getElementById("info").style.display = "block";
        const boxes = document.getElementsByClassName("box");
        let temp = document.getElementById('btn-container');
        temp.replaceWith(temp.cloneNode(true));
        temp = document.getElementById("reset");
        temp.replaceWith(temp.cloneNode(true));
        temp = document.getElementById("clear-score");
        temp.replaceWith(temp.cloneNode(true));
        temp = document.getElementById("rename");
        temp.replaceWith(temp.cloneNode(true));

        Array.from(boxes).forEach((element) => {
            element.replaceWith(element.cloneNode(true));
            element.innerHTML = "";
        });
        startDoubleGame();
        document.getElementById('mode').innerHTML = "Play with Computer";
    } else {
        executeFuncLocal = false;
        executeFuncComp = true;
        const boxes = document.getElementsByClassName("box");
        let temp = document.getElementById('btn-container');
        temp.replaceWith(temp.cloneNode(true));

        temp = document.getElementById("reset");
        temp.replaceWith(temp.cloneNode(true));
        temp = document.getElementById("clear-score");
        temp.replaceWith(temp.cloneNode(true));
        temp = document.getElementById("rename");
        temp.replaceWith(temp.cloneNode(true));

        Array.from(boxes).forEach((element) => {
            element.replaceWith(element.cloneNode(true));
            element.innerHTML = "";
        });
        startComputer();
        document.getElementById('mode').innerHTML = "Play with Local";
    }
});



const volumeIcon = document.getElementById('volume');
let isMuted = false;

volumeIcon.addEventListener('click', function () {
    if (isMuted) {
        volumeIcon.src = 'volume-up.png';
        volumeIcon.classList.remove('clicked');
        isMuted = false;
    } else {
        volumeIcon.src = 'mute.png';
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

    updateNames();

    document.getElementById('modeselect').style.display = 'none';
    document.getElementById('btn-container').addEventListener("click", startGame);

    function updateNames() {
        const player1Name = localStorage.getItem('player1Name');
        const player2Name = localStorage.getItem('player2Name');

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
    }

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

    let leftname = localStorage.getItem('player1Name');
    let rightname = localStorage.getItem('player2Name');

    const obj = {
        "X": leftname,
        "O": rightname,
    }

    let gameover = new Audio("{{url_for('static',filename='gameover.mp3')}}");
    let turn = localStorage.getItem("turn") ? localStorage.getItem("turn") : null;

    if (turn == null) {
        let x = Math.random();
        turn = x < 0.5 ? "X" : "O";
    }

    let isGameOver = false;
    let moveCount = localStorage.getItem("move") ? parseInt(localStorage.getItem("move")) : 0;
    let player1Score = localStorage.getItem("ply1") ? parseInt(localStorage.getItem("ply1")) : 0;
    let player2Score = localStorage.getItem("ply2") ? parseInt(localStorage.getItem("ply2")) : 0;
    let tieScore = localStorage.getItem("tie") ? parseInt(localStorage.getItem("tie")) : 0;

    const imgBox = document.querySelectorAll(".imgbox");

    if (moveCount != 0)
        document.querySelector(".info").innerText = `Turn for ${obj[turn]}`;
    else
        document.querySelector(".info").innerText = `Start from ${obj[turn]}`;


    function loadGameState() {
        const savedState = JSON.parse(localStorage.getItem("gameState"));
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
        localStorage.setItem("gameState", JSON.stringify(gameState));
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
        localStorage.removeItem("gameState");
        moveCount = 0;
        localStorage.setItem("move", '0');
        const boxTexts = document.querySelectorAll(".boxtext");
        boxTexts.forEach((element) => {
            element.innerHTML = "";
        });
        let x = Math.random();
        turn = x < 0.5 ? "X" : "O";
        localStorage.setItem("turn", `${turn}`);

        isGameOver = false;
        imgBox[0].style.display = "none";
        imgBox[1].style.display = "none";
        document.querySelector(".info").innerText = `Start from ${obj[turn]}`;
    };

    const checkDraw = () => {
        if (moveCount === 9) {
            const boxTexts = document.getElementsByClassName("boxtext");
            document.getElementById("info").innerText = "Match tied";

            let blinkInterval = setInterval(() => {
                Array.from(boxTexts).forEach(e => {
                    e.classList.toggle("blinking");
                });
            }, 150);

            updateTieScore(++tieScore);
            localStorage.setItem("tie", `${tieScore}`);

            setTimeout(() => {
                clearInterval(blinkInterval);
                Array.from(boxTexts).forEach(e => {
                    e.classList.remove("blinking");
                });
                resetGame();
            }, 800);

            return true;
        }
        else {
            return false;
        }
    };



    const checkWin = () => {
        const boxTexts = document.getElementsByClassName("boxtext");
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        winPatterns.forEach((pattern) => {
            if (
                boxTexts[pattern[0]].innerText === boxTexts[pattern[1]].innerText &&
                boxTexts[pattern[2]].innerText === boxTexts[pattern[1]].innerText &&
                boxTexts[pattern[0]].innerText !== ""
            ) {
                let blinkInterval = setInterval(() => {
                    boxTexts[pattern[0]].classList.toggle("blinking");
                    boxTexts[pattern[1]].classList.toggle("blinking");
                    boxTexts[pattern[2]].classList.toggle("blinking");
                }, 200);

                if (boxTexts[pattern[0]].innerText === "X") {
                    imgBox[0].style.display = "block";
                    updatePlayerScore(++player1Score);
                    localStorage.setItem("ply1", `${player1Score}`);
                } else {
                    updatePlayer2Score(++player2Score);
                    localStorage.setItem("ply2", `${player2Score}`);
                    imgBox[1].style.display = "block";
                }
                document.querySelector(".info").innerText = `${obj[boxTexts[pattern[0]].innerText]} Won`;
                isGameOver = true;
                if (!isMuted) { play_gameover(); }

                setTimeout(() => {
                    clearInterval(blinkInterval);
                    boxTexts[pattern[0]].classList.remove("blinking");
                    boxTexts[pattern[1]].classList.remove("blinking");
                    boxTexts[pattern[2]].classList.remove("blinking");
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
                localStorage.setItem("move", `${moveCount}`);
                checkWin();
                if (!isGameOver) {
                    if (!checkDraw()) {
                        document.querySelector(".info").innerText = `Turn for ${obj[turn]}`;
                        localStorage.setItem("turn", `${turn}`);
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

    let playerName = null

    updateNames();


    document.getElementById('info').style.display = 'none';
    document.getElementById('modeselect').style.display = 'none';
    document.getElementById('btn-container-for-computer').addEventListener("click", startGame);
    document.querySelector('.score.ply2 p:nth-child(1)').innerText = `Computer (O)`;

    function updateNames() {
        playerName = localStorage.getItem('playerName');

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

    let gameover = new Audio("{{url_for('static',filename='gameover.mp3')}}");
    let moveWithCoputer = localStorage.getItem("moveWithCoputer") ? parseInt(localStorage.getItem("moveWithCoputer")) : 0;



    let isGameOver = false;
    let playerScore = localStorage.getItem("ply") ? parseInt(localStorage.getItem("ply")) : 0;
    let computerScore = localStorage.getItem("computerScore") ? parseInt(localStorage.getItem("computerScore")) : 0;
    let tieScore = localStorage.getItem("tiecomputer") ? parseInt(localStorage.getItem("tiecomputer")) : 0;
    const imgBox = document.querySelectorAll(".imgbox");

    function loadGameState() {
        const savedState = JSON.parse(localStorage.getItem("gameStatecompter"));
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
        localStorage.setItem("gameStatecompter", JSON.stringify(gameState));
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
    let x = Math.random();
    let turn = x < 0.5 ? "X" : "O";

    function resetGame() {
        localStorage.removeItem("gameStatecompter");
        document.getElementById("info").style.display = "none";
        moveWithCoputer = 0;
        localStorage.removeItem("moveWithCoputer");
        const boxTexts = document.querySelectorAll(".boxtext");
        boxTexts.forEach((element) => {
            element.innerHTML = "";
        });
        let x = Math.random();
        let turn = x < 0.6 ? "X" : "O";
        if (turn == "O") {
            let y = Math.floor(Math.random() * 9);
            boxTexts.forEach((element, ind) => {
                if (y == ind) {
                    element.innerHTML = "O"
                }
            });
            moveWithCoputer++;
            localStorage.setItem("moveWithCoputer", `${moveWithCoputer}`);
        }
        saveGameState();
        if (!isMuted) { play_gameover(); }
        isGameOver = false;
        imgBox[0].style.display = "none";
        imgBox[1].style.display = "none";
    };

    function checkDraw() {
        if (moveWithCoputer === 9) {
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
            if (!isMuted) { play_gameover(); }
            return true;
        }
        else {
            return false;
        }
    };


    let obj = {
        "X": playerName,
        "O": "Computer",
    }


    const checkWin = () => {
        const boxTexts = document.getElementsByClassName("boxtext");
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        winPatterns.forEach((pattern) => {
            if (
                boxTexts[pattern[0]].innerText === boxTexts[pattern[1]].innerText &&
                boxTexts[pattern[2]].innerText === boxTexts[pattern[1]].innerText &&
                boxTexts[pattern[0]].innerText !== ""
            ) {
                let blinkInterval = setInterval(() => {
                    boxTexts[pattern[0]].classList.toggle("blinking");
                    boxTexts[pattern[1]].classList.toggle("blinking");
                    boxTexts[pattern[2]].classList.toggle("blinking");
                }, 200);

                if (boxTexts[pattern[0]].innerText === "X") {
                    imgBox[0].style.display = "block";
                    updatePlayerScore(++playerScore);
                    localStorage.setItem("ply", `${playerScore}`);
                } else {
                    updatePlayer2Score(++computerScore);
                    localStorage.setItem("computerScore", `${computerScore}`);
                    imgBox[1].style.display = "block";
                }

                document.getElementById("info").style.display = "block";
                document.getElementById("info").innerHTML = `${obj[boxTexts[pattern[0]].innerHTML]} Won`;
                isGameOver = true;
                if (!isMuted) { play_gameover(); }


                setTimeout(() => {
                    clearInterval(blinkInterval);
                    boxTexts[pattern[0]].classList.remove("blinking");
                    boxTexts[pattern[1]].classList.remove("blinking");
                    boxTexts[pattern[2]].classList.remove("blinking");
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
                if (!isMuted) { play_turn_x(); }
                saveGameState();
                moveWithCoputer++;
                localStorage.setItem("moveWithCoputer", `${moveWithCoputer}`);
                checkWin();
                if (!isGameOver) {
                    if (!checkDraw()) {
                        setTimeout(() => computerMove(), 300);
                    }
                }
            }
        });
    });


    const PLAYER = 'X';
    const COMPUTER = 'O';

    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function checkWinner(board, player) {
        for (let combo of winningCombos) {
            if (combo.every(index => board[index] === player)) {
                return true;
            }
        }
        return false;
    }

    function isBoardFull(board) {
        return board.every(cell => cell === PLAYER || cell === COMPUTER);
    }

    function minimax(board, depth, isMaximizing) {
        if (checkWinner(board, COMPUTER)) return 10 - depth;
        if (checkWinner(board, PLAYER)) return depth - 10;
        if (isBoardFull(board)) return 0;

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = COMPUTER;
                    let eval = minimax(board, depth + 1, false);
                    board[i] = null;
                    maxEval = Math.max(maxEval, eval);
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = PLAYER;
                    let eval = minimax(board, depth + 1, true);
                    board[i] = null;
                    minEval = Math.min(minEval, eval);
                }
            }
            return minEval;
        }
    }

    function findBestMove(board) {
        let bestMove = -1;
        let bestValue = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = COMPUTER;
                let moveValue = minimax(board, 0, false);
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
        let board = [];
        const boxes = document.getElementsByClassName("box");
        Array.from(boxes).forEach((element) => {
            const boxText = element.querySelector(".boxtext");
            if (boxText.innerText != '')
                board.push(boxText.innerText);
            else {
                board.push(null);
            }
        });
        let temp = findBestMove(board);
        Array.from(boxes).forEach((element, index) => {
            const boxText = element.querySelector(".boxtext");
            if (temp == index) {
                element.classList.add("hover")
                boxText.innerHTML = "O";
                setTimeout(() => {
                    element.classList.remove("hover");
                    localStorage.setItem("moveWithCoputer", ++moveWithCoputer);
                    checkWin();
                    if (!isGameOver) {
                        checkDraw();
                    }
                    saveGameState();
                }, 200);
            }
        });
    }




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