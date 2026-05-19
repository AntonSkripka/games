import confetti from 'canvas-confetti';

const yearForm = document.getElementById("yearForm");
const yearInput = document.getElementById("year");
const yearSpan = document.getElementById("leap-year__result");

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function checkAndUnlockYearAchievements(isLeap) {
    const username = localStorage.getItem('headerName');
    if (!username) return;

    unlockAchievement(username, 'yearCheck', 'first_check');

    if (isLeap) {
        unlockAchievement(username, 'yearCheck', 'leap_found');
    }
}

yearForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const inputValue = yearInput.value.trim();
    const yearNumber = Number(inputValue);

    if (inputValue === "" || isNaN(yearNumber) || yearNumber <= 0) {
        yearSpan.innerText = "Будь ласка, введіть коректний рік!";
        yearSpan.style.color = "orange";
        return;
    }

    yearSpan.removeAttribute("style");

    const isLeap = isLeapYear(yearNumber);

    if (isLeap) {
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

    checkAndUnlockYearAchievements(isLeap);

    yearInput.value = "";
});