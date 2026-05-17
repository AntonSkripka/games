import confetti from 'canvas-confetti';

const guessForm = document.getElementById("guessNumberForm");
const guessInput = document.getElementById("guessInput");
const guessSpan = document.getElementById("guessNumberText");

function winAnimation() {
  confetti({ particleCount: 150, spread: 80, origin: { x: 0, y: 1 } });
  confetti({ particleCount: 150, spread: 80, origin: { x: 1, y: 1 } });

  setTimeout(() => {
    confetti({ particleCount: 100, spread: 100, origin: { x: 0.5, y: 0.4 } });
  }, 300);
}

guessForm.addEventListener("submit", (e) => {
    guessSpan.removeAttribute("style");
    e.preventDefault();
    if (Number(guessInput.value) < 1 || Number(guessInput.value) > 10) {
        guessSpan.innerText = "Введіть число у діапазоні!";
        return;
    };

    const computerNumber = Math.ceil(Math.random() * 10);

    if (Number(guessInput.value) === computerNumber) {
        guessSpan.innerText = "Ви вгадали число!";
        guessSpan.style.fontSize = "24px";
        guessSpan.style.color = "green";
        winAnimation();
    } else {
        guessSpan.innerText = `Комп'ютер загадав число ${computerNumber}`;
        guessSpan.style.color = "red";
    }

    guessInput.value = "";
});