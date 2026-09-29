// Shared formatting for model-generated replies posted to Twitch chat.

const TWITCH_MAX_MESSAGE_LENGTH = 500

const clampToMaxChars = (text, maxChars) => {
	if (!text) return ''
	const trimmed = String(text).trim()
	return trimmed.length > maxChars
		? trimmed.slice(0, maxChars - 1).trimEnd() + '…'
		: trimmed
}

const normalizeChatMessage = (text) => {
	if (!text) return ''
	return (
		String(text)
			.replace(/```+[a-z]*/gi, ' ')
			.replace(/^\s*[-*]\s+/gm, '')
			.replace(/\*\*|__/g, '')
			.replace(/`/g, '')
			.replace(/\s+/g, ' ')
			.trim()
			// Twitch executes a message beginning with "/" or "." as a chat command.
			.replace(/^[/.]+\s*/, '')
			.trim()
	)
}

const toChatMessage = (text, maxChars = 450) =>
	clampToMaxChars(normalizeChatMessage(text), maxChars)

module.exports = {
	TWITCH_MAX_MESSAGE_LENGTH,
	clampToMaxChars,
	normalizeChatMessage,
	toChatMessage,
}
