const {
	commandList,
	sceneChangeCommandList,
	popupChangeCommandList,
} = require('../command-list/commandList')

const commandTypes = {
	STANDARD: 'standard',
	SCENE_CHANGE: 'scene-change',
	POPUP_CHANGE: 'popup-change',
}

const defaultMetadataByType = {
	[commandTypes.STANDARD]: {
		aliases: [],
		cooldownMs: 0,
		description: '',
		permissions: ['everyone'],
		requiresObs: false,
	},
	[commandTypes.SCENE_CHANGE]: {
		aliases: [],
		cooldownMs: 0,
		description: '',
		permissions: ['everyone'],
		requiresObs: true,
	},
	[commandTypes.POPUP_CHANGE]: {
		aliases: [],
		cooldownMs: 0,
		description: '',
		permissions: ['everyone'],
		requiresObs: true,
	},
}

// Optional metadata can be added here without changing command handler imports.
const commandMetadata = {
	standard: {},
	sceneChange: {},
	popupChange: {},
}

const normalizeCommandName = (command) => String(command).toLowerCase()

const createCommandEntry = (command, handler, type, metadata = {}) => ({
	...defaultMetadataByType[type],
	...metadata,
	name: command,
	type,
	handler,
	execute: ({ channel, tags, args, client, obs, command, locks }) => {
		if (type === commandTypes.POPUP_CHANGE) {
			return handler(
				channel,
				tags,
				args,
				client,
				obs,
				command,
				locks.popupChangeLock,
			)
		}

		if (type === commandTypes.SCENE_CHANGE) {
			return handler(
				channel,
				tags,
				args,
				client,
				obs,
				command,
				locks.sceneChangeLock,
			)
		}

		return handler(
			channel,
			tags,
			args,
			client,
			obs,
			locks.sceneChangeLock,
			locks.countdownLock,
		)
	},
})

const registerCommand = (registry, command, handler, type, metadata = {}) => {
	const commandName = normalizeCommandName(command)
	if (registry[commandName]) {
		throw new Error(`Duplicate command registered: ${commandName}`)
	}

	const entry = createCommandEntry(commandName, handler, type, metadata)
	registry[commandName] = entry

	for (const alias of entry.aliases) {
		const aliasName = normalizeCommandName(alias)
		if (registry[aliasName]) {
			throw new Error(
				`Command alias ${aliasName} conflicts with an existing command`,
			)
		}

		registry[aliasName] = {
			...entry,
			aliasOf: commandName,
			name: aliasName,
		}
	}
}

const buildCommandRegistry = () => {
	const registry = {}

	for (const [command, handler] of Object.entries(commandList)) {
		registerCommand(
			registry,
			command,
			handler,
			commandTypes.STANDARD,
			commandMetadata.standard[command],
		)
	}

	for (const [command, handler] of Object.entries(sceneChangeCommandList)) {
		registerCommand(
			registry,
			command,
			handler,
			commandTypes.SCENE_CHANGE,
			commandMetadata.sceneChange[command],
		)
	}

	for (const [command, handler] of Object.entries(popupChangeCommandList)) {
		registerCommand(
			registry,
			command,
			handler,
			commandTypes.POPUP_CHANGE,
			commandMetadata.popupChange[command],
		)
	}

	return registry
}

const commandRegistry = buildCommandRegistry()

const getCommand = (command) => commandRegistry[normalizeCommandName(command)]

const listCommands = () => Object.values(commandRegistry)

module.exports = {
	commandRegistry,
	commandMetadata,
	commandTypes,
	getCommand,
	listCommands,
}
