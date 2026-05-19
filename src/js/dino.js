document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("dino-board");
    const ctx = canvas.getContext("2d");
    const startBtn = document.querySelector(".dino__btn");
    const resultDisplay = document.querySelector(".dino__result");

    const BOARD_WIDTH = 750;
    const BOARD_HEIGHT = 250;
    canvas.width = BOARD_WIDTH;
    canvas.height = BOARD_HEIGHT;

    const IMG_PATH = "./images/dino/";

    const images = {};
    const imgNames = [
        "dino", "dino-run1", "dino-run2", "dino-jump", "dino-dead",
        "cactus1", "cactus2", "cactus3", "ground"
    ];

    let loadedImagesCount = 0;
    imgNames.forEach(name => {
        images[name] = new Image();
        images[name].src = `${IMG_PATH}${name}.png`;
        images[name].onload = () => {
            loadedImagesCount++;
            if (loadedImagesCount === imgNames.length) {
                drawInitialState();
            }
        };
    });

    let isGameRunning = false;
    let score = 0;
    let gameSpeed = 6;
    let animationId;

    let groundX = 0;
    const groundY = 220;

    const dino = {
        x: 50,
        y: 160, 
        width: 50,
        height: 60,
        velocityY: 0,
        gravity: 0.6,
        jumpForce: -11,
        isJumping: false,
        legToggle: true,
        tickCount: 0     
    };

    let cacti = [];
    let nextCactusTime = 0;

    function drawInitialState() {
        ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        ctx.drawImage(images["ground"], groundX, groundY, BOARD_WIDTH, 20);
        ctx.drawImage(images["dino"], dino.x, dino.y, dino.width, dino.height);
    }

    startBtn.addEventListener("click", () => {
        if (!isGameRunning) {
            initGame();
        }
        startBtn.blur();
    });

    window.addEventListener("keydown", (e) => {
        if ((e.code === "Space" || e.code === "ArrowUp") && !dino.isJumping && isGameRunning) {
            e.preventDefault();
            dino.velocityY = dino.jumpForce;
            dino.isJumping = true;
        }
    });

    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (!dino.isJumping && isGameRunning) {
            dino.velocityY = dino.jumpForce;
            dino.isJumping = true;
        }
    });

    function initGame() {
        if (loadedImagesCount < imgNames.length) return;
        
        isGameRunning = true;
        score = 0;
        gameSpeed = 6;
        cacti = [];
        nextCactusTime = 0;
        
        dino.y = 160;
        dino.velocityY = 0;
        dino.isJumping = false;
        
        startBtn.textContent = "Спочатку";
        resultDisplay.textContent = `Результат: ${score}`;

        if (animationId) cancelAnimationFrame(animationId);
        updateGame();
    }

    function updateGame() {
        if (!isGameRunning) return;

        ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

        groundX -= gameSpeed;
        if (groundX <= -BOARD_WIDTH) groundX = 0;
        ctx.drawImage(images["ground"], groundX, groundY, BOARD_WIDTH, 20);
        ctx.drawImage(images["ground"], groundX + BOARD_WIDTH, groundY, BOARD_WIDTH, 20);

        dino.velocityY += dino.gravity;
        dino.y += dino.velocityY;

        if (dino.y >= 160) {
            dino.y = 160;
            dino.velocityY = 0;
            dino.isJumping = false;
        }

        let currentDinoImg = images["dino"];
        if (dino.isJumping) {
            currentDinoImg = images["dino-jump"];
        } else {
            dino.tickCount++;
            if (dino.tickCount > 8) {
                dino.legToggle = !dino.legToggle;
                dino.tickCount = 0;
            }
            currentDinoImg = dino.legToggle ? images["dino-run1"] : images["dino-run2"];
        }

        ctx.drawImage(currentDinoImg, dino.x, dino.y, dino.width, dino.height);

        if (nextCactusTime <= 0) {
            generateCactus();
            nextCactusTime = Math.floor(Math.random() * 50) + 60 - (gameSpeed * 2);
        }
        nextCactusTime--;

        for (let i = cacti.length - 1; i >= 0; i--) {
            let cactus = cacti[i];
            cactus.x -= gameSpeed;

            ctx.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

            if (checkCollision(dino, cactus)) {
                gameOver();
                return;
            }

            if (cactus.x + cactus.width < 0) {
                cacti.splice(i, 1);
                score++;
                resultDisplay.textContent = `Результат: ${score}`;
                
                if (score % 5 === 0 && gameSpeed < 15) {
                    gameSpeed += 0.5;
                }
            }
        }

        animationId = requestAnimationFrame(updateGame);
    }

    function generateCactus() {
        const types = [
            { img: "cactus1", width: 23, height: 46, y: 174 },
            { img: "cactus2", width: 45, height: 46, y: 174 },
            { img: "cactus3", width: 65, height: 48, y: 172 }
        ];

        const randomType = types[Math.floor(Math.random() * types.length)];

        cacti.push({
            img: images[randomType.img],
            x: BOARD_WIDTH,
            y: randomType.y,
            width: randomType.width,
            height: randomType.height
        });
    }

    function checkCollision(rect1, rect2) {
        const padding = 5;
        return (
            rect1.x + padding < rect2.x + rect2.width - padding &&
            rect1.x + rect1.width - padding > rect2.x + padding &&
            rect1.y + padding < rect2.y + rect2.height - padding &&
            rect1.y + rect1.height - padding > rect2.y + padding
        );
    }

    function gameOver() {
        isGameRunning = false;
        cancelAnimationFrame(animationId);
        
        ctx.drawImage(images["dino-dead"], dino.x, dino.y, dino.width, dino.height);
        
        startBtn.textContent = "Старт";
        resultDisplay.textContent = `Гра закінчена! Рахунок: ${score}`;

        onGameComplete(score);
    }

    function onGameComplete(finalScore) {
        const username = localStorage.getItem('headerName');

        if (typeof unlockAchievement === "function") {
            unlockAchievement(username, 'dino', 'first_game');

            if (finalScore >= 100) {
                unlockAchievement(username, 'dino', 'score_100');
            }

            if (finalScore >= 500) {
                unlockAchievement(username, 'dino', 'score_500');
            }
        } else {
            console.warn("Функція unlockAchievement не знайдена");
        }
    }
});