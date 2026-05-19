import confetti from 'canvas-confetti';

const guessForm = document.getElementById("guessNumberForm");
const guessInput = document.getElementById("guessInput");
const guessSpan = document.getElementById("guessNumberText");
const guessBtn = guessForm.querySelector(".guess-number__button");

let computerNumber = generateRandomNumber();
let attempts = 0;
let isGameBlocked = false;

function generateRandomNumber() {
    return Math.ceil(Math.random() * 10);
}

function winAnimation() {
    confetti({ particleCount: 150, spread: 80, origin: { x: 0, y: 1 } });
    confetti({ particleCount: 150, spread: 80, origin: { x: 1, y: 1 } });

    setTimeout(() => {
        confetti({ particleCount: 100, spread: 100, origin: { x: 0.5, y: 0.4 } });
    }, 300);
}

function checkAndUnlockAchievements(attemptsCount) {
    const username = localStorage.getItem('headerName');
    if (!username) return; 

    if (attemptsCount === 1) {
        unlockAchievement(username, 'guessNumber', 'first_guess');
    }

    if (attemptsCount === 2) {
        unlockAchievement(username, 'guessNumber', 'lucky');
    }

    if (attemptsCount <= 5) {
        unlockAchievement(username, 'guessNumber', 'detective');
    }
}

guessForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (isGameBlocked) return;

    guessSpan.removeAttribute("style");
    const userGuess = Number(guessInput.value);

    if (userGuess < 1 || userGuess > 10) {
        guessSpan.innerText = "Введіть число у діапазоні!";
        guessSpan.style.color = "orange";
        return;
    }

    attempts++;

    if (userGuess === computerNumber) {
        guessSpan.innerText = `Ви вгадали число за ${attempts} спр.!`;
        guessSpan.style.fontSize = "24px";
        guessSpan.style.color = "green";
        winAnimation();

        checkAndUnlockAchievements(attempts);

        isGameBlocked = true;
        guessInput.disabled = true;
        if (guessBtn) guessBtn.disabled = true;

        setTimeout(() => {
            computerNumber = generateRandomNumber();
            attempts = 0;
            
            guessSpan.innerText = "Гру перезапущено! Вгадайте нове число.";
            guessSpan.style.color = "var(--text-color, #fff)";
            guessSpan.style.fontSize = "16px";
            
            guessInput.value = "";
            guessInput.disabled = false;
            if (guessBtn) guessBtn.disabled = false;
            isGameBlocked = false;
        }, 3000);
        
    } else {
        const hint = userGuess < computerNumber ? "Більше" : "Менше";
        guessSpan.innerText = `Не вгадали! Загадане число ${hint}. Спроба №${attempts}`;
        guessSpan.style.color = "red";
        guessInput.value = "";
    }
});