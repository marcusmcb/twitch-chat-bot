const showVideoClip = async (obs) => {
	console.log('SHOWING VIDEO CLIP')
	let currentScene
	await obs.call('GetCurrentProgramScene').then((data) => {
		currentScene = data.currentProgramSceneName
	})
	let sceneItemId
	await obs
		.call('GetSceneItemList', { sceneName: currentScene })
		.then((data) => {			
			const sceneItem = data.sceneItems.find(
				(item) => item.sourceName === 'cash_drop'
			)
			if (sceneItem) {
				sceneItemId = sceneItem.sceneItemId
			}
		})

	if (sceneItemId) {
		await obs.call('SetSceneItemEnabled', {
			sceneName: currentScene,
			sceneItemId: sceneItemId,
			sceneItemEnabled: true,
		})
		setTimeout(async () => {
			await obs.call('SetSceneItemEnabled', {
				sceneName: currentScene,
				sceneItemId: sceneItemId,
				sceneItemEnabled: false,
			})
		}, 5000)
	}
}

const activeBlackjackGames = new Map()
const BLACKJACK_SESSION_TTL_MS = 5 * 60 * 1000

const createDeck = () => {
	const suits = ['hearts', 'diamonds', 'clubs', 'spades']
	const values = [
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'J',
		'Q',
		'K',
		'A',
	]
	let deck = []
	for (let suit of suits) {
		for (let value of values) {
			deck.push({ value, suit })
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

const createPlayerHand = (cards) => ({
	cards,
	doubled: false,
	finished: false,
	lockedAfterDeal: false,
})

const getBlackjackSessionKey = (channel, username) =>
	`${String(channel).toLowerCase()}:${String(username).toLowerCase()}`

const getCardLabel = (card) => card.value

const formatHand = (hand) => hand.map(getCardLabel).join('-')

const formatActionList = (actions) => {
	if (actions.length === 1) {
		return actions[0]
	}

	if (actions.length === 2) {
		return `${actions[0]} or ${actions[1]}`
	}

	return `${actions.slice(0, -1).join(', ')}, or ${actions[actions.length - 1]}`
}

const getSession = (channel, username) => {
	const sessionKey = getBlackjackSessionKey(channel, username)
	const session = activeBlackjackGames.get(sessionKey)

	if (!session) {
		return null
	}

	if (Date.now() - session.lastActionAt > BLACKJACK_SESSION_TTL_MS) {
		activeBlackjackGames.delete(sessionKey)
		return null
	}

	return session
}

const saveSession = (channel, username, session) => {
	activeBlackjackGames.set(getBlackjackSessionKey(channel, username), {
		...session,
		lastActionAt: Date.now(),
	})
}

const clearSession = (channel, username) => {
	activeBlackjackGames.delete(getBlackjackSessionKey(channel, username))
}

const calculateHandValue = (hand) => {
	let value = 0
	let aces = 0
	for (let card of hand) {
		if (card.value === 'A') {
			aces += 1
			value += 11
		} else if (['K', 'Q', 'J'].includes(card.value)) {
			value += 10
		} else {
			value += parseInt(card.value)
		}
	}
	while (value > 21 && aces > 0) {
		value -= 10
		aces -= 1
	}
	return value
}


const playDealerHand = (deck, dealerHand) => {
	while (calculateHandValue(dealerHand) < 17) {
		dealerHand.push(drawCard(deck))
	}
	return dealerHand
}

const getHandValue = (hand) => calculateHandValue(hand.cards)

const getCurrentPlayerHand = (session) =>
	session.playerHands[session.currentHandIndex] || null

const getHandName = (handIndex, totalHands) =>
	totalHands > 1 ? `Hand ${handIndex + 1}` : 'Hand'

const getActorLabel = (session, tags) =>
	session.playerHands.length === 1
		? `@${tags.username}`
		: getHandName(session.currentHandIndex, session.playerHands.length)

const formatPlayerHandSummary = (hand, handIndex, totalHands) =>
	`${getHandName(handIndex, totalHands)}: ${formatHand(hand.cards)} (${getHandValue(
		hand,
	)})`

const getNextPlayableHandIndex = (session, startIndex) =>
	session.playerHands.findIndex(
		(hand, handIndex) => handIndex > startIndex && !hand.finished,
	)

const canDouble = (hand) =>
	hand.cards.length === 2 && !hand.doubled && !hand.finished && !hand.lockedAfterDeal

const canSplit = (session, hand) => {
	if (session.playerHands.length !== 1 || hand.finished || hand.cards.length !== 2) {
		return false
	}

	return hand.cards[0].value === hand.cards[1].value
}

const isSplitAcesHand = (hand) => hand.lockedAfterDeal

const getAvailableActions = (session) => {
	const currentHand = getCurrentPlayerHand(session)
	if (!currentHand) {
		return []
	}

	const actions = ['hit', 'stand']
	if (canDouble(currentHand)) {
		actions.push('double')
	}
	if (canSplit(session, currentHand)) {
		actions.push('split')
	}

	return actions
}

const buildCurrentHandPrompt = (session, tags) => {
	const currentHand = getCurrentPlayerHand(session)
	const dealerUpCard = getCardLabel(session.dealerHand[0])
	const totalHands = session.playerHands.length
	const actions = formatActionList(getAvailableActions(session))
	const actionPrompt = actions ? `${actions}?` : 'waiting for dealer.'

	if (totalHands === 1) {
		return `Dealer shows ${dealerUpCard}. @${tags.username} has ${formatHand(
			currentHand.cards,
		)} (${getHandValue(currentHand)}). ${actionPrompt}`
	}

	const allHands = session.playerHands
		.map((hand, handIndex) => formatPlayerHandSummary(hand, handIndex, totalHands))
		.join('. ')

	return `Dealer shows ${dealerUpCard}. @${tags.username} ${allHands}. Playing ${getHandName(
			session.currentHandIndex,
			totalHands,
		)}: ${formatHand(currentHand.cards)} (${getHandValue(currentHand)}). ${actionPrompt}`
}

const markCurrentHandFinished = (session) => {
	const currentHand = getCurrentPlayerHand(session)
	if (currentHand) {
		currentHand.finished = true
	}

	const nextPlayableHandIndex = getNextPlayableHandIndex(
		session,
		session.currentHandIndex,
	)
	if (nextPlayableHandIndex !== -1) {
		session.currentHandIndex = nextPlayableHandIndex
		return true
	}

	return false
}

const settleAutomaticTwentyOneHands = (session) => {
	const completedHands = []

	while (true) {
		const currentHand = getCurrentPlayerHand(session)
		if (
			!currentHand ||
			currentHand.finished ||
			(getHandValue(currentHand) !== 21 && !isSplitAcesHand(currentHand))
		) {
			break
		}

		const handName = getHandName(session.currentHandIndex, session.playerHands.length)
		completedHands.push(
			isSplitAcesHand(currentHand)
				? `${handName} is locked after split aces`
				: `${handName} reached 21`,
		)
		currentHand.finished = true

		const nextPlayableHandIndex = getNextPlayableHandIndex(
			session,
			session.currentHandIndex,
		)

		if (nextPlayableHandIndex === -1) {
			break
		}

		session.currentHandIndex = nextPlayableHandIndex
	}

	return completedHands
}

const formatDealerInitialHand = (dealerHand) =>
	dealerHand.slice(0, 2).map(getCardLabel).join('-')

const formatDealerFinalClause = (dealerHand, initialDealerCardCount, dealerValue) => {
	const drawnCards = dealerHand.slice(initialDealerCardCount)
	if (drawnCards.length === 0) {
		return `Dealer shows ${formatHand(dealerHand)} (${dealerValue}).`
	}

	const dealerOutcome =
		dealerValue > 21
			? `busts with ${dealerValue}`
			: `has ${formatHand(dealerHand)} (${dealerValue})`

	return `Dealer shows ${formatDealerInitialHand(
		dealerHand,
	)}, and draws ${drawnCards.map(getCardLabel).join(', ')}, and ${dealerOutcome}.`
}

const startBlackjackGame = () => {
	const deck = shuffleDeck(createDeck())
	const playerHand = [drawCard(deck), drawCard(deck)]
	const dealerHand = [drawCard(deck), drawCard(deck)]

	return { deck, playerHand, dealerHand }
}

const resolvePlayerHandAgainstDealer = (hand, dealerValue, handIndex, totalHands) => {
	const handName = getHandName(handIndex, totalHands)
	const handValue = getHandValue(hand)

	if (handValue > 21) {
		return `${handName} busts with ${handValue}`
	}

	if (dealerValue > 21) {
		return `${handName} wins with ${handValue}`
	}

	if (handValue > dealerValue) {
		return `${handName} wins with ${handValue}`
	}

	if (handValue < dealerValue) {
		return `${handName} loses with ${handValue}`
	}

	return `${handName} pushes with ${handValue}`
}

const getMultiHandOutcome = (hand, dealerValue, handIndex, totalHands) => {
	const handName = getHandName(handIndex, totalHands)
	const handValue = getHandValue(hand)

	if (handValue > 21) {
		return `${handName} busts with ${handValue}.`
	}

	if (dealerValue > 21) {
		return `${handName} wins with ${handValue}!`
	}

	if (handValue > dealerValue) {
		return `${handName} wins with ${handValue}!`
	}

	if (handValue < dealerValue) {
		return `${handName} loses with ${handValue}.`
	}

	return `${handName} pushes with ${handValue}.`
}

const getSingleHandOutcome = (hand, dealerValue, username) => {
	const handValue = getHandValue(hand)

	if (handValue > 21) {
		return `@${username} busts with ${handValue}. Dealer wins.`
	}

	if (dealerValue > 21) {
		return `@${username} wins with ${handValue}!`
	}

	if (handValue > dealerValue) {
		return `@${username} wins with ${handValue}!`
	}

	if (handValue < dealerValue) {
		return `Dealer wins with ${dealerValue}.`
	}

	return `Push at ${handValue}.`
}

const buildSingleHandActionSummary = (session, tags, actionText) =>
	`${getActorLabel(session, tags)} ${actionText}`

const finalizeBlackjackSession = (channel, tags, client, obs, session, actionSummary) => {
	const initialDealerCardCount = session.dealerHand.length
	const liveHands = session.playerHands.filter((hand) => getHandValue(hand) <= 21)

	if (liveHands.length > 0) {
		playDealerHand(session.deck, session.dealerHand)
	}

	const dealerValue = calculateHandValue(session.dealerHand)
	if (session.playerHands.length === 1) {
		const [hand] = session.playerHands
		const dealerSummary = formatDealerFinalClause(
			session.dealerHand,
			initialDealerCardCount,
			dealerValue,
		)
		const outcome = getSingleHandOutcome(hand, dealerValue, tags.username)
		const handValue = getHandValue(hand)
		const hasWinningHand =
			handValue <= 21 && (dealerValue > 21 || handValue > dealerValue)

		if (hasWinningHand) {
			showVideoClip(obs)
		}

		client.say(
			channel,
			`${actionSummary} Dealer shows ${dealerSummary.slice('Dealer shows '.length)} ${outcome}`,
		)
		return
	}

	const playerSummary = session.playerHands
		.map(
			(hand, handIndex) =>
				`${getHandName(handIndex, session.playerHands.length)} ${formatHand(
					hand.cards,
				)} (${getHandValue(hand)}).`,
		)
		.join(', ')
	const dealerSummary = formatDealerFinalClause(
		session.dealerHand,
		initialDealerCardCount,
		dealerValue,
	)
	const results = session.playerHands
		.map((hand, handIndex) =>
			getMultiHandOutcome(
				hand,
				dealerValue,
				handIndex,
				session.playerHands.length,
			),
		)
		.join(' ')
	const hasWinningHand = session.playerHands.some((hand) => {
		const handValue = getHandValue(hand)
		return handValue <= 21 && (dealerValue > 21 || handValue > dealerValue)
	})

	if (hasWinningHand) {
		showVideoClip(obs)
	}

	client.say(
		channel,
		`${actionSummary} @${tags.username} has split hands ${playerSummary} ${dealerSummary} ${results}`,
	)
}

const continueOrFinalizeSession = (
	channel,
	tags,
	client,
	obs,
	session,
	actionSummary,
) => {
	const autoCompletedHands = settleAutomaticTwentyOneHands(session)
	const autoSummary =
		autoCompletedHands.length > 0
			? ` ${autoCompletedHands.join('. ')}.`
			: ''

	if (session.playerHands.every((hand) => hand.finished)) {
		finalizeBlackjackSession(
			channel,
			tags,
			client,
			obs,
			session,
			`${actionSummary}${autoSummary}`,
		)
		clearSession(channel, tags.username)
		return
	}

	saveSession(channel, tags.username, session)
	client.say(
		channel,
		`${actionSummary}${autoSummary} ${buildCurrentHandPrompt(session, tags)}`,
	)
}

const announceImmediateBlackjackResult = (
	channel,
	tags,
	client,
	obs,
	playerHand,
	dealerHand,
) => {
	const playerValue = calculateHandValue(playerHand)
	const dealerValue = calculateHandValue(dealerHand)
	let result

	if (playerValue === 21 && dealerValue === 21) {
		result = `Both have blackjack. Push.`
	} else if (playerValue === 21) {
		showVideoClip(obs)
		result = `@${tags.username} has blackjack and wins! 🏆`
	} else {
		result = `Dealer has blackjack and wins.`
	}

	client.say(
		channel,
		`@${tags.username} has ${formatHand(playerHand)} (${playerValue}). Dealer shows ${formatHand(
			dealerHand,
		)} (${dealerValue}). ${result}`,
	)
}

// Command for blackjack
const blackjackCommand = (channel, tags, args, client, obs) => {
	console.log('BLACKJACK COMMAND')
	const existingSession = getSession(channel, tags.username)
	const existingHand = existingSession
		? getCurrentPlayerHand(existingSession) || existingSession.playerHands[0]
		: null
	if (existingSession) {
		client.say(
			channel,
			`@${tags.username}, you already have a blackjack hand in progress: ${formatHand(
				existingHand.cards,
			)} (${getHandValue(existingHand)}). Use ${formatActionList(
				getAvailableActions(existingSession),
			)}.`,
		)
		return
	}

	const { deck, playerHand, dealerHand } = startBlackjackGame()
	const playerValue = calculateHandValue(playerHand)
	const dealerValue = calculateHandValue(dealerHand)
	const dealerUpCard = dealerHand[0]

	if (playerValue === 21 || dealerValue === 21) {
		announceImmediateBlackjackResult(
			channel,
			tags,
			client,
			obs,
			playerHand,
			dealerHand,
		)
		return
	}

	const session = {
		deck,
		dealerHand,
		playerHands: [createPlayerHand(playerHand)],
		currentHandIndex: 0,
	}

	saveSession(channel, tags.username, session)
	client.say(channel, buildCurrentHandPrompt(session, tags))
}

const blackjackHitCommand = (channel, tags, args, client, obs) => {
	console.log('BLACKJACK HIT COMMAND')
	const session = getSession(channel, tags.username)

	if (!session) {
		client.say(
			channel,
			`@${tags.username}, you don't have an active blackjack hand. Use !blackjack to start one.`,
		)
		return
	}

	const currentHand = getCurrentPlayerHand(session)
	const nextCard = drawCard(session.deck)
	currentHand.cards.push(nextCard)
	const playerValue = getHandValue(currentHand)

	if (playerValue > 21) {
		currentHand.finished = true
		continueOrFinalizeSession(
			channel,
			tags,
			client,
			obs,
			session,
			buildSingleHandActionSummary(
				session,
				tags,
				`draws ${getCardLabel(nextCard)} and busts with ${formatHand(
					currentHand.cards,
				)} (${playerValue}).`,
			),
		)
		return
	}

	if (playerValue === 21) {
		currentHand.finished = true
		continueOrFinalizeSession(
			channel,
			tags,
			client,
			obs,
			session,
			buildSingleHandActionSummary(
				session,
				tags,
				`draws ${getCardLabel(nextCard)} and reaches 21 with ${formatHand(
					currentHand.cards,
				)}.`,
			),
		)
		return
	}

	continueOrFinalizeSession(
		channel,
		tags,
		client,
		obs,
		session,
		buildSingleHandActionSummary(
			session,
			tags,
			`draws ${getCardLabel(nextCard)} and now has ${formatHand(
				currentHand.cards,
			)} (${playerValue}).`,
		),
	)
}

const blackjackStandCommand = (channel, tags, args, client, obs) => {
	console.log('BLACKJACK STAND COMMAND')
	const session = getSession(channel, tags.username)

	if (!session) {
		client.say(
			channel,
			`@${tags.username}, you don't have an active blackjack hand. Use !blackjack to start one.`,
		)
		return
	}

	const currentHand = getCurrentPlayerHand(session)
	const handName = getHandName(session.currentHandIndex, session.playerHands.length)
	const handSummary = `${formatHand(currentHand.cards)} (${getHandValue(currentHand)})`
	const standSummary =
		session.playerHands.length === 1
			? `@${tags.username} stands with ${handSummary}.`
			: `${handName} stands on ${handSummary}.`
	markCurrentHandFinished(session)
	continueOrFinalizeSession(
		channel,
		tags,
		client,
		obs,
		session,
		standSummary,
	)
}

const blackjackDoubleCommand = (channel, tags, args, client, obs) => {
	console.log('BLACKJACK DOUBLE COMMAND')
	const session = getSession(channel, tags.username)

	if (!session) {
		client.say(
			channel,
			`@${tags.username}, you don't have an active blackjack hand. Use !blackjack to start one.`,
		)
		return
	}

	const currentHand = getCurrentPlayerHand(session)
	if (!canDouble(currentHand)) {
		client.say(
			channel,
			`@${tags.username}, you can only double on a two-card hand before taking another action.`,
		)
		return
	}

	const nextCard = drawCard(session.deck)
	currentHand.cards.push(nextCard)
	currentHand.doubled = true
	currentHand.finished = true
	const playerValue = getHandValue(currentHand)

	continueOrFinalizeSession(
		channel,
		tags,
		client,
		obs,
		session,
		buildSingleHandActionSummary(
			session,
			tags,
			`doubles and draws ${getCardLabel(nextCard)} for ${formatHand(
				currentHand.cards,
			)} (${playerValue}).`,
		),
	)
}

const blackjackSplitCommand = (channel, tags, args, client, obs) => {
	console.log('BLACKJACK SPLIT COMMAND')
	const session = getSession(channel, tags.username)

	if (!session) {
		client.say(
			channel,
			`@${tags.username}, you don't have an active blackjack hand. Use !blackjack to start one.`,
		)
		return
	}

	const currentHand = getCurrentPlayerHand(session)
	if (!canSplit(session, currentHand)) {
		client.say(
			channel,
			`@${tags.username}, you can only split an opening pair with matching ranks.`,
		)
		return
	}

	const firstSplitHand = createPlayerHand([
		currentHand.cards[0],
		drawCard(session.deck),
	])
	const secondSplitHand = createPlayerHand([
		currentHand.cards[1],
		drawCard(session.deck),
	])
	const isAceSplit = currentHand.cards[0].value === 'A'

	if (isAceSplit) {
		firstSplitHand.lockedAfterDeal = true
		secondSplitHand.lockedAfterDeal = true
	}

	session.playerHands = [firstSplitHand, secondSplitHand]
	session.currentHandIndex = 0

	continueOrFinalizeSession(
		channel,
		tags,
		client,
		obs,
		session,
		`@${tags.username} splits into Hand 1: ${formatHand(firstSplitHand.cards)} (${getHandValue(
			firstSplitHand,
		)}) and Hand 2: ${formatHand(secondSplitHand.cards)} (${getHandValue(
			secondSplitHand,
		)}).${isAceSplit ? ' Split aces get one card each only.' : ''}`,
	)
}

module.exports = {
	blackjackCommand: blackjackCommand,
	blackjackDoubleCommand: blackjackDoubleCommand,
	blackjackHitCommand: blackjackHitCommand,
	blackjackSplitCommand: blackjackSplitCommand,
	blackjackStandCommand: blackjackStandCommand,
}
