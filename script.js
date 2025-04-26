const originalCards = [
    'keksztekercs.png', 'keksztekercs.png',
    'fanta_szelet1.png', 'fanta_szelet1.png',
    'gesztenyesziv1.png', 'gesztenyesziv1.png',
    'mignon.png', 'mignon.png',
    'linzer.png', 'linzer.png',
    'dobos.png', 'dobos.png',
    'piskotatekerc.png', 'piskotatekerc.png',
    'kokuszkocka.png', 'kokuszkocka.png',
    'barack1.png', 'barack1.png',
];

let cards = [];
const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const attemptsDisplay = document.getElementById('attempts');
const bestTimeDisplay = document.getElementById('bestTime');
const winMessage = document.getElementById('winMessage');
const restartButton = document.getElementById('restartButton');

const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const winSound = document.getElementById('winSound');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let attempts = 0;
let startTime;
let timerInterval;
let bestTime = localStorage.getItem('bestTime') ? parseInt(localStorage.getItem('bestTime')) : null;

function setupGame() {
    cards = [...originalCards];
    cards.sort(() => 0.5 - Math.random());
    gameBoard.innerHTML = '';
    cards.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        const img = document.createElement('img');
        img.src = image;
        card.appendChild(img);
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchesFound = 0;
    attempts = 0;
    attemptsDisplay.textContent = 'Próbálkozások: 0';
    updateBestTimeDisplay();
    winMessage.style.display = 'none';
    restartButton.style.display = 'none';
    startTime = Date.now();
    clearInterval(timerInterval);
    startTimer();
}

restartButton.onclick = () => setupGame();

setupGame();

function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;

    flipSound.play();
    card.classList.add('flipped');
    const img = card.querySelector('img');
    img.style.display = 'block';

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    attempts++;
    attemptsDisplay.textContent = `Próbálkozások: ${attempts}`;
    checkForMatch();
}

function checkForMatch() {
    const firstImg = firstCard.querySelector('img').src;
    const secondImg = secondCard.querySelector('img').src;
    const isMatch = firstImg === secondImg;
    if (isMatch) {
        matchSound.play();
        matchesFound++;
        resetCards();
        if (matchesFound === cards.length / 2) {
            showWinMessage();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.querySelector('img').style.display = 'none';
            secondCard.querySelector('img').style.display = 'none';
            resetCards();
        }, 1000);
    }
}

function resetCards() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function showWinMessage() {
    clearInterval(timerInterval);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    let newRecord = false;
    if (bestTime === null || elapsedTime < bestTime) {
        bestTime = elapsedTime;
        localStorage.setItem('bestTime', bestTime);
        newRecord = true;
    }
    winMessage.textContent = `Gratulálok, minden párt megtaláltál! Idő: ${elapsedTime} másodperc, Próbálkozások: ${attempts}` + (newRecord ? " (Új rekord!)" : "");
    winMessage.style.display = 'block';
    restartButton.style.display = 'inline-block';
    winSound.play();

    // Konfetti
    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
    });

    updateBestTimeDisplay();
}

function updateBestTimeDisplay() {
    if (bestTime !== null) {
        bestTimeDisplay.textContent = `Legjobb idő: ${bestTime} másodperc`;
    } else {
        bestTimeDisplay.textContent = 'Legjobb idő: nincs';
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Eltelt idő: ${elapsed} másodperc`;
    }, 1000);
}
