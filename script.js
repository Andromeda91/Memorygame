function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;

    card.classList.add('flipped');
    const img = card.querySelector('img');
    img.style.display = 'block';
    flipSound.play();

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    attempts++;
    attemptsDisplay.textContent = `Próbálkozások: ${attempts}`;
    lockBoard = true; // lezárjuk a táblát amíg ellenőrzünk
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
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.querySelector('img').style.display = 'none';
            secondCard.querySelector('img').style.display = 'none';
            resetCards();
        }, 1000); // csak akkor fordul vissza 1 másodperc után ha nem egyezik
    }
}
