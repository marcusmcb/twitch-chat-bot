const adjectives = [
	'happy',
	'sad',
	'big',
	'small',
	'tall',
	'short',
	'fast',
	'slow',
	'hot',
	'cold',
	'young',
	'old',
	'good',
	'bad',
	'strong',
	'weak',
	'bright',
	'dark',
	'clean',
	'dirty',
	'soft',
	'hard',
	'sweet',
	'sour',
	'quiet',
	'loud',
	'brave',
	'scared',
	'kind',
	'cruel',
	'funny',
	'serious',
	'friendly',
	'shy',
	'calm',
	'wild',
	'beautiful',
	'ugly',
	'smart',
	'wasted',
	'flaky',
	'washed',
	'stoned',
	'dumb',
	'happy',
	'angry',
	'polite',
	'rude',
	'patient',
	'impatient',
	'generous',
	'selfish',
	'honest',
	'dishonest',
	'sobering',
	'exotic',
	'unbelievable',
	'overgrown',
	'unhinged',
	'tingly',
	'pungent',
	'askew',
	'triumphant',
	'exacerbated',
	'salty',
	'greasy',
	'filthy',
	'unstable',
	'sparkly',
	'god-like',
	'paltry',
	'fountainous',
]

const nouns = [
	'cat',
	'dog',
	'house',
	'car',
	'book',
	'tree',
	'flower',
	'river',
	'mountain',
	'sun',
	'moon',
	'star',
	'beach',
	'ocean',
	'bird',
	'fish',
	'computer',
	'phone',
	'chair',
	'table',
	'pen',
	'pencil',
	'school',
	'teacher',
	'student',
	'friend',
	'family',
	'city',
	'country',
	'food',
	'music',
	'movie',
	'game',
	'money',
	'time',
	'water',
	'fire',
	'air',
	'earth',
	'sky',
	'road',
	'door',
	'window',
	'key',
	'shirt',
	'shoe',
	'eye',
	'hand',
	'heart',
	'mind',
  'windsheild',
  'doorknob',
  'printer',
  'fax machine',
  'ipod',
  'shoestring',
  'bathwater',
  'ankle bracelet',
	'dream',
	'toothbrush',
	'fingernail',
	'pinky toe',
	'hoodie',
	'shoe',
	'trash can',
	'turntable',
	'doordash order',
]

// add verbs and rework response to include it

const getRandomElement = (array) => {
	return array[Math.floor(Math.random() * array.length)]
}

const myCommand = (channel, tags, args, client) => {
	const adjective1 = getRandomElement(adjectives)
	const noun = getRandomElement(nouns)
	const adjective2 = getRandomElement(adjectives)

	const response = `${adjective1} ${noun} is ${adjective2}.`
	client.say(channel, response)
}

module.exports = {
	myCommand: myCommand,
}