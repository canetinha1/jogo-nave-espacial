const gameContainer = document.getElementById('game-container');
const spaceship = document.getElementById('spaceship');
const scoreDisplay = document.getElementById('score');
const lifeDisplay = document.getElementById('life');
const startButton = document.getElementById('start-button');

let spaceshipX = 275; // Posição inicial da nave
let bullets = [];
let asteroids = [];
let score = 0;
let life = 3;
let gameInterval;
let asteroidInterval;
let isGameRunning = false;

// Movimento da nave
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;

    if (e.key === 'ArrowLeft' && spaceshipX > 0) {
        spaceshipX -= 10;
    }
    if (e.key === 'ArrowRight' && spaceshipX < 550) {
        spaceshipX += 10;
    }
    if (e.key === ' ') {
        shoot();
    }
    spaceship.style.left = `${spaceshipX}px`;
});

// Atirar
function shoot() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${spaceshipX + 22}px`;
    bullet.style.bottom = '60px';
    gameContainer.appendChild(bullet);
    bullets.push(bullet);

    const bulletInterval = setInterval(() => {
        const bulletBottom = parseInt(bullet.style.bottom);
        if (bulletBottom > 400) {
            bullet.remove();
            clearInterval(bulletInterval);
            bullets = bullets.filter(b => b !== bullet);
        } else {
            bullet.style.bottom = `${bulletBottom + 5}px`;
        }

        // Verificar colisão com asteroides
        asteroids.forEach((asteroid, index) => {
            if (checkCollision(bullet, asteroid)) {
                bullet.remove();
                asteroid.remove();
                bullets = bullets.filter(b => b !== bullet);
                asteroids.splice(index, 1);
                score++;
                scoreDisplay.textContent = score;
            }
        });
    }, 20);
}

// Criar asteroides
function createAsteroid() {
    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');
    const asteroidX = Math.floor(Math.random() * 560);
    asteroid.style.left = `${asteroidX}px`;
    asteroid.style.top = '0px';
    gameContainer.appendChild(asteroid);
    asteroids.push(asteroid);

    const asteroidInterval = setInterval(() => {
        const asteroidTop = parseInt(asteroid.style.top);
        if (asteroidTop > 400) {
            asteroid.remove();
            clearInterval(asteroidInterval);
            asteroids = asteroids.filter(a => a !== asteroid);
        } else {
            asteroid.style.top = `${asteroidTop + 3}px`;
        }

        // Verificar colisão com a nave
        if (checkCollision(asteroid, spaceship)) {
            asteroid.remove();
            life--;
            lifeDisplay.textContent = life;
            if (life <= 0) {
                endGame();
            }
        }
    }, 20);
}

// Verificar colisão
function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return !(
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}

// Iniciar jogo
function startGame() {
    isGameRunning = true;
    score = 0;
    life = 3;
    scoreDisplay.textContent = score;
    lifeDisplay.textContent = life;
    bullets.forEach(bullet => bullet.remove());
    asteroids.forEach(asteroid => asteroid.remove());
    bullets = [];
    asteroids = [];

    gameInterval = setInterval(() => {
        createAsteroid();
    }, 1000);
}

// Finalizar jogo
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    alert(`Fim de jogo! Sua pontuação foi ${score}.`);
}

startButton.addEventListener('click', startGame);