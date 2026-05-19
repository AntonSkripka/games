document.addEventListener("DOMContentLoaded", () => {
    const gamePlace = document.querySelector(".football__place");
    const ball = document.querySelector(".football__ball");
    const gate = document.querySelector(".football__gate");
    const countDisplay = document.querySelector(".football__count");
    const countNumber = document.querySelector(".football__count-number");
    const startOverlay = document.querySelector(".football__start");
    const startBtn = document.querySelector(".football__button-start");

    let score = 0;
    let lives = 3;
    let isGameRunning = false;
    let gameState = "idle";
    
    let gateDirection = 1;
    let gateSpeed = 3;
    let gateInterval;

    let power = 0;
    let powerDirection = 1;
    let powerInterval;
    let savedClickEvent = null;

    const UIContainer = document.createElement("div");
    UIContainer.className = "football__ui";
    UIContainer.innerHTML = `
        <div class="football__lives" style="position:absolute; top:10px; right:20px; font-family:sans-serif; font-size:14px; font-weight:bold;">Життя: ❤️❤️❤️</div>
        <div class="football__power-bar-wrapper" style="position:absolute; bottom:15px; left:15px; width:150px; height:15px; border:2px solid #000; background:#fff; display:none; border-radius:5px; overflow:hidden;">
            <div class="football__power-bar" style="width:0%; height:100%; background: linear-gradient(90deg, green, yellow, red);"></div>
        </div>
    `;
    gamePlace.appendChild(UIContainer);

    const livesDisplay = UIContainer.querySelector(".football__lives");
    const powerWrapper = UIContainer.querySelector(".football__power-bar-wrapper");
    const powerBar = UIContainer.querySelector(".football__power-bar");

    startBtn.addEventListener("click", () => {
        if (!isGameRunning) {
            startGame();
        } else {
            resetGame();
        }
    });

    function startGame() {
        isGameRunning = true;
        score = 0;
        lives = 3;
        gameState = "idle";
        countNumber.textContent = score;
        updateLivesUI();
        
        countDisplay.style.visibility = "visible";
        if (startOverlay) startOverlay.style.display = "none";
        
        startBtn.textContent = "Скинути гру";
        resetBall();
        
        clearInterval(gateInterval);
        gateInterval = setInterval(moveGateLogic, 1000 / 60);
    }

    function moveGateLogic() {
        if (!isGameRunning || gameState === "charging") return; 

        const fieldHeight = gamePlace.clientHeight;
        const gateHeight = gate.offsetHeight;
        let currentTop = gate.offsetTop;

        currentTop += gateSpeed * gateDirection;

        if (currentTop <= 10) {
            currentTop = 10;
            gateDirection = 1;
        } else if (currentTop >= fieldHeight - gateHeight - 10) {
            currentTop = fieldHeight - gateHeight - 10;
            gateDirection = -1;
        }

        gate.style.top = `${currentTop}px`;
    }

    gamePlace.addEventListener("click", (event) => {
        if (!isGameRunning) return;

        if (gameState === "idle") {
            gameState = "charging";
            savedClickEvent = event;
            power = 0;
            powerDirection = 1;
            powerWrapper.style.display = "block";

            powerInterval = setInterval(() => {
                power += 4 * powerDirection;
                if (power >= 100) {
                    power = 100;
                    powerDirection = -1;
                } else if (power <= 0) {
                    power = 0;
                    powerDirection = 1;
                }
                powerBar.style.width = `${power}%`;
            }, 20);
            return;
        }

        if (gameState === "charging") {
            clearInterval(powerInterval);
            powerWrapper.style.display = "none";
            gameState = "kicked";
            
            executeKick(savedClickEvent, power);
        }
    });

    function executeKick(event, finalPower) {
        const rect = gamePlace.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const ballRadius = ball.offsetWidth / 2;
        let targetX = clickX - ballRadius;
        let targetY = clickY - ballRadius;

        let isBlunder = false;
        if (finalPower > 85) {
            targetY -= 60;
            targetX += 40;
            isBlunder = true;
        } else if (finalPower < 25) {
            targetX = gamePlace.clientWidth / 2;
            isBlunder = true;
        }

        ball.classList.remove("reset-position");
        ball.style.left = `${targetX}px`;
        ball.style.top = `${targetY}px`;

        const isGoal = !isBlunder && checkGoal(clickX, clickY);

        setTimeout(() => {
            if (isGoal) {
                score++;
                countNumber.textContent = score;
                gateSpeed = Math.min(3 + score * 0.4, 8); 
                showFeedback("ГОЛ!", "green");
            } else {
                lives--;
                updateLivesUI();
                showFeedback("ПРОМАХ!", "red");
            }

            setTimeout(() => {
                if (lives <= 0) {
                    gameOver();
                } else {
                    resetBall();
                    gameState = "idle";
                }
            }, 600);

        }, 300);
    }

    function checkGoal(x, y) {
        const gateLeft = gate.offsetLeft;
        const gateTop = gate.offsetTop;
        const gateWidth = gate.offsetWidth;
        const gateHeight = gate.offsetHeight;

        const realWidth = gateHeight; 
        const realHeight = gateWidth;
        
        const gateMinX = gateLeft + (gateWidth / 2) - (realWidth / 2);
        const gateMaxX = gateMinX + realWidth;
        const gateMinY = gateTop + (gateHeight / 2) - (realHeight / 2);
        const gateMaxY = gateMinY + realHeight;

        return x >= gateMinX && x <= gateMaxX && y >= gateMinY && y <= gateMaxY;
    }

    function updateLivesUI() {
        livesDisplay.textContent = "Життя: " + "❤️".repeat(Math.max(0, lives));
    }

    function showFeedback(text, color) {
        const feedback = document.createElement("div");
        feedback.textContent = text;
        feedback.style.cssText = `position:absolute; top:45%; left:40%; font-family:Montserrat Alternates; font-size:24px; color:${color}; font-weight:bold; z-index:100; pointer-events:none;`;
        gamePlace.appendChild(feedback);
        setTimeout(() => feedback.remove(), 600);
    }

    function resetBall() {
        ball.classList.add("reset-position");
        ball.style.left = "";
        ball.style.top = "";
    }

    function resetGame() {
        clearInterval(gateInterval);
        clearInterval(powerInterval);
        powerWrapper.style.display = "none";
        resetBall();
        if (startOverlay) startOverlay.style.display = "flex";
        startBtn.textContent = "Запустити гру";
        countDisplay.style.visibility = "hidden";
        isGameRunning = false;
        gameState = "idle";
        gateSpeed = 3;
    }

    function gameOver() {
        isGameRunning = false;
        clearInterval(gateInterval);
        
        showFeedback("ГРУ ЗАКІНЧЕНО!", "black");
        startBtn.textContent = "Запустити знову";
        if (startOverlay) startOverlay.style.display = "flex";
    }
});