const createDeck = () => {
	const suits = ['♦️', '♣️', '♠️', '♥️']
	const cards = [
		{
			name: '2',
			value: 2,
		},
		{
			name: '3',
			value: 3,
		},
		{
			name: '4',
			value: 4,
		},
		{
			name: '5',
			value: 5,
		},
		{
			name: '6',
			value: 6,
		},
		{
			name: '7',
			value: 7,
		},
		{
			name: '8',
			value: 8,
		},
		{
			name: '9',
			value: 9,
		},
		{
			name: '10',
			value: 10,
		},
		{
			name: 'J',
			value: 10,
		},
		{
			name: 'Q',
			value: 10,
		},
		{
			name: 'K',
			value: 10,
		},
		{
			name: 'A',
			value: 11,
		},
	]
	let deck = []
	for (let suit of suits) {
		for (let card of cards) {
			deck.push({ card, suit })
		}
	}
	return deck
}

const shuffleDeck = (deck) => {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[deck[i], deck[j]] = [deck[j], deck[i]]
	}
	return deck
}

const drawCard = (deck) => {
	return deck.pop()
}

const highLowCommand = (channel, tags, args, client) => {
	const deck = shuffleDeck(createDeck())
	const playerCard = drawCard(deck)
	const botCard = drawCard(deck)
	if (args.length === 0) {
		if (playerCard.card.value > botCard.card.value) {
			client.say(
				channel,
				`${tags.username} drew the ${playerCard.card.name} ${playerCard.suit} and the dealer drew a ${botCard.card.name} ${botCard.suit}. You win!`
			)
		} else if (playerCard.card.value === botCard.card.value) {
			client.say(
				channel,
				`${tags.username} drew the ${playerCard.card.name} ${playerCard.suit} and the dealer drew a ${botCard.card.name} ${botCard.suit}. It's a tie!`
			)
		} else {
			client.say(
				channel,
				`${tags.username} drew the ${playerCard.card.name} ${playerCard.suit} and the dealer drew a ${botCard.card.name} ${botCard.suit}. You lose!`
			)
		}
	} else {
		if (playerCard.card.value > botCard.card.value) {
			client.say(
				channel,
				`${tags.username} drew the ${playerCard.card.name} ${playerCard.suit} and ${args} drew a ${botCard.card.name} ${botCard.suit}. You win!`
			)
		} else if (playerCard.card.value === botCard.card.value) {
			client.say(
				channel,
				`${tags.username} drew the ${playerCard.card.name} ${playerCard.suit} and ${args} drew a ${botCard.card.name} ${botCard.suit}. It's a tie!`
			)
		} else {
			client.say(
				channel,
				`${tags.username} drew the ${playerCard.card.name} ${playerCard.suit} and ${args} drew a ${botCard.card.name} ${botCard.suit}. You lose!`
			)
		}
	}
}

module.exports = {
	highLowCommand: highLowCommand,
}
