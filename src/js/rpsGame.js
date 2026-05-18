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

playerList.addEventListener("click", (e) => {
    rspSpan.removeAttribute("style");
    if (e.target != e.currentTarget) {
        const compChoice = choice[Math.floor(Math.random() * choice.length)];
        rspBtn.innerHTML = `Варіант комп’ютера: ${compChoice}`;
        if (winComb[e.target.id] === compChoice) {
            rspSpan.innerHTML = `Ви виграли раунд!`;
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
        } else if (winComb[compChoice] === e.target.id) {
            compScore.innerHTML = Number(compScore.innerHTML) + 1;
            rspSpan.innerHTML = `Ви програли раунд!`;
            rspSpan.style.color = "red";
        } else {
            rspSpan.innerHTML = `Ничія!`;
            rspSpan.style.color = "black";
        }
    }
})