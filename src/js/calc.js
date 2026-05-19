const inputFirst = document.querySelector(".calculator__input-first");
const inputSecond = document.querySelector(".calculator__input-second");
const operationsContainer = document.querySelector(".calculator__action");
const resultBtn = document.querySelector("#resultCalc");
const resultSpan = document.querySelector(".calculator__result");

const operations = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
};

let activeOperation = null;

function checkAndUnlockCalculatorAchievements() {
  const username = localStorage.getItem('headerName');
  if (!username) return;

  const calcKey = `calcCount_${username}`;
  let calcCount = parseInt(localStorage.getItem(calcKey) || '0') + 1;

  if (calcCount === 1) {
    unlockAchievement(username, 'calculator', 'first_calc');
  }

  if (calcCount >= 100) {
    unlockAchievement(username, 'calculator', 'hundred_calcs');
  }

  localStorage.setItem(calcKey, calcCount);
}

operationsContainer.addEventListener("click", (e) => {
  const clickedBtn = e.target;
  if (clickedBtn === e.currentTarget || !clickedBtn.dataset.action) return;

  const currentActive = operationsContainer.querySelector(".clicked");
  if (currentActive) currentActive.classList.remove("clicked");

  clickedBtn.classList.add("clicked");
  activeOperation = clickedBtn.dataset.action;
});

const resetErrors = () => {
  inputFirst.style.borderColor = "";
  inputSecond.style.borderColor = "";
};

const validateAndGetValues = () => {
  resetErrors();

  const val1 = Number(inputFirst.value);
  const val2 = Number(inputSecond.value);
  let isValid = true;

  if (inputFirst.value.trim() === "" || isNaN(val1) || !isFinite(val1)) {
    inputFirst.style.borderColor = "red";
    isValid = false;
  }

  if (inputSecond.value.trim() === "" || isNaN(val2) || !isFinite(val2)) {
    inputSecond.style.borderColor = "red";
    isValid = false;
  }

  if (isValid && activeOperation === "/" && val2 === 0) {
    inputSecond.style.borderColor = "red";
    resultSpan.textContent = "Ділити на нуль не можна!";
    return null;
  }

  if (!activeOperation || !operations[activeOperation]) {
    resultSpan.textContent = "Оберіть операцію!";
    return null;
  }

  if (!isValid) {
    resultSpan.textContent = "Некоректні дані!";
    return null;
  }

  return { num1: val1, num2: val2 };
};

resultBtn.addEventListener("click", () => {
  const data = validateAndGetValues();
  
  if (!data) return;

  const calculate = operations[activeOperation];
  resultSpan.textContent = calculate(data.num1, data.num2);

  checkAndUnlockCalculatorAchievements();
});