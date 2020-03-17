//add varaibles
let blackjackGame = {
    you: {
        scoreSpan: '#your-blackjack-result',
        div: '#your-box',
        score: 0
    },
    dealer: {
        scoreSpan: '#dealer-blackjack-result',
        div: '#dealer-box',
        score: 0
    },
    cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    cardsMap: {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        J: 10,
        Q: 10,
        K: 10,
        A: [1, 11]
    },
    wins: 0,
    losses: 0,
    draws: 0,
    isStand: false,
    turnsOver: false
};
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
//add sound
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lostSound = new Audio('sounds/aww.mp3');

// eventlistner for hit button
document
    .querySelector('#blackjack-hit-button')
    .addEventListener('click', blackjackHit);

//eventlistner for deal button
document
    .querySelector('#blackjack-deal-button')
    .addEventListener('click', blackjackDeal);
//eventlistner for stand button
document
    .querySelector('#blackjack-stand-button')
    .addEventListener('click', dealerLogic);

//function for hit button
function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

//select random card
function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

//showcard function to show card an play sound
function showCard(activePlayer, card) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    } else {}
}

//create deal function - all images should disapear
function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {
        blackjackGame['isStand'] = false;
        //select all you images inside your-box
        let yourImages = document
            .querySelector('#your-box')
            .querySelectorAll('img');
        let dealerImages = document
            .querySelector('#dealer-box')
            .querySelectorAll('img');
        //remove images from your box
        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        //remove images from dealer box
        for (i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }
        //reset score back to 0
        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        //fix red styling
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = '#fff';

        document.querySelector('#blackjack-result').textContent = "Let's play ";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = true;
    }
}

function updateScore(card, activePlayer) {
    //check wheather A -1 or 11
    if (card === 'A') {
        //if 11 keeps me under 21, add11. Otherwize, add 1
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 11) {
            activePlayer['score'] = +blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] = +blackjackGame['cardsMap'][card][0];
        }
    } else {
        //get active player score
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent =
            activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(DEALER, card);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    if (DEALER['score'] > 15) {
        blackjackGame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);
    }
}

//helps compute winner and who won
// update win, dra and losses table
function computeWinner() {
    let winner;
    //if you do not bust
    if (YOU['score'] <= 21) {
        //condition: higer score than dealer
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGame['wins']++;
            winner = YOU;
            //condition: lower score than dealer
        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
            //condition: both score equal
        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        }
        //if you bust, score is more than 21 and the dealer does not bust
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;
        // when you and dealer both bust
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }
    //return the winner
    console.log(`The winner is ${winner}`);
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {
        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];

            message = 'You lost!';
            messageColor = 'red';
            lostSound.play();
        } else {
            message = 'You drew!';
            document.querySelector('#draws').textContent = blackjackGame['draws'];

            messageColor = 'black';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}