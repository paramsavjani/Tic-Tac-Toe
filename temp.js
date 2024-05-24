function startDoubleGame() {

    updateNames();

    document.getElementById('modeselect').style.display = 'none';
    document.getElementById('btn-container').addEventListener("click", startGame);

    function updateNames() {
        const player1Name = localStorage.getItem(`player1Name`);
        const player2Name = localStorage.getItem(`player2Name`);

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
        }
        else {
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
                if (!isMuted) { play_gameover(); }

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

    function generateWinPatterns(boardSize, winCondition) {
        const winPatterns = [];

        // Rows and columns
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

        // Diagonals
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



