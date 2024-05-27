const createDeck = () => {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const drawCard = (deck) => {
  return deck.pop();
};

const calculateHandValue = (hand) => {
  let value = 0;
  let aces = 0;
  for (let card of hand) {
    if (card.value === 'A') {
      aces += 1;
      value += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }
  return value;
};

const playDealerHand = (deck, dealerHand) => {
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(drawCard(deck));
  }
  return dealerHand;
};

const basicStrategy = (playerHand, dealerUpCard) => {
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue([dealerUpCard]);

  if (playerValue <= 10) {
    return 'hit';
  } else if (playerValue >= 17) {
    return 'stand';
  } else if (playerValue >= 12 && playerValue <= 16) {
    if (dealerValue >= 2 && dealerValue <= 6) {
      return 'stand';
    } else {
      return 'hit';
    }
  } else {
    return 'hit';
  }
};

const playBlackjack = () => {
  let deck = shuffleDeck(createDeck());
  let playerHand = [drawCard(deck), drawCard(deck)];
  let dealerHand = [drawCard(deck), drawCard(deck)];

  let dealerUpCard = dealerHand[0];

  while (basicStrategy(playerHand, dealerUpCard) === 'hit') {
    playerHand.push(drawCard(deck));
  }

  if (calculateHandValue(playerHand) <= 21) {
    dealerHand = playDealerHand(deck, dealerHand);
  }

  return { playerHand, dealerHand };
};

const formatHand = (hand) => {
  return hand.map(card => `${card.value} of ${card.suit}`).join(', ');
};

// Command for blackjack
const blackjackCommand = (channel, tags, args, client) => {
  const { playerHand, dealerHand } = playBlackjack();

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  let result;
  if (playerValue > 21) {
    result = `@${tags.username} busts with ${playerValue}! Dealer wins with ${dealerValue}.`;
  } else if (dealerValue > 21) {
    result = `Dealer busts with ${dealerValue}! @${tags.username} wins with ${playerValue}! 🏆`;
  } else if (playerValue > dealerValue) {
    result = `@${tags.username} wins with ${playerValue}! Dealer has ${dealerValue}. 🏆`;
  } else if (playerValue < dealerValue) {
    result = `Dealer wins with ${dealerValue}. @${tags.username} has ${playerValue}.`;
  } else {
    result = `It's a tie! Both @${tags.username} and the dealer have ${playerValue}.`;
  }

  client.say(channel, `@${tags.username} has ${formatHand(playerHand)} (${playerValue}). Dealer has ${formatHand(dealerHand)} (${dealerValue}). ${result}`);
};

module.exports = {  
  blackjackCommand: blackjackCommand
};
