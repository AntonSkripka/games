import confetti from 'canvas-confetti';

const winComb = {
    rock: "scissors",
    scissors: "paper",
    paper: "rock"
};

const choice = ["scissors", "paper", "rock"];

const playerList = document.getElementById("playerList");
const compScore = document.querySelector(".computer-score");
const playerScore = document.querySelector(".player-score");
const rspSpan = document.querySelector(".rps-game__status");
const rspBtn = document.querySelector(".rps-game__btn");

let consecutiveWins = 0;

function checkAndUnlockRpsAchievements(playerWon, isDraw) {
    const username = localStorage.getItem('headerName');
    if (!username) return;

    if (playerWon) {
        consecutiveWins++;

        unlockAchievement(username, 'rpsGame', 'first_win');

        if (consecutiveWins >= 5) {
            unlockAchievement(username, 'rpsGame', 'five_wins');
        }

        const winsKey = `rpsGameWins_${username}`;
        const totalWins = parseInt(localStorage.getItem(winsKey) || '0') + 1;
        localStorage.setItem(winsKey, totalWins);

        if (totalWins >= 10) {
            unlockAchievement(username, 'rpsGame', 'master');
        }
    } else {
        if (!isDraw) {
            consecutiveWins = 0;
        }
    }
}

playerList.addEventListener("click", (e) => {
    rspSpan.removeAttribute("style");
    
    if (e.target !== e.currentTarget && e.target.id) {
        const compChoice = choice[Math.floor(Math.random() * choice.length)];
        rspBtn.innerHTML = `Варіант комп’ютера: ${compChoice}`;
        
        if (winComb[e.target.id] === compChoice) {
            rspSpan.innerHTML = `Ви виграли раунд!`;
            rspSpan.style.color = "green";
            playerScore.innerHTML = Number(playerScore.innerHTML) + 1;
            
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: 0, y: 0.8 }
            });
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: 1, y: 0.8 }
            });

            checkAndUnlockRpsAchievements(true, false);

        } else if (winComb[compChoice] === e.target.id) {
            compScore.innerHTML = Number(compScore.innerHTML) + 1;
            rspSpan.innerHTML = `Ви програли раунд!`;
            rspSpan.style.color = "red";

            checkAndUnlockRpsAchievements(false, false);

        } else {
            rspSpan.innerHTML = `Нічия!`;
            rspSpan.style.color = "var(--text-color, #fff)";

            checkAndUnlockRpsAchievements(false, true);
        }
    }
});