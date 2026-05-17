import confetti from 'canvas-confetti';

const yearForm = document.getElementById("yearForm");
const yearInput = document.getElementById("year");
const yearSpan = document.getElementById("leap-year__result");

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

yearForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isLeapYear(Number(yearInput.value))) {
        yearSpan.innerText = "Ви народилися у високосний рік!";
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
    } else {
        yearSpan.innerText = "Ви народилися не у високосний рік!";
    }
    yearInput.value = "";
})