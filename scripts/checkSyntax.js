const { readdirSync, statSync } = require('fs')
const { join } = require('path')
const { spawnSync } = require('child_process')

const ignoredDirectories = new Set(['.git', 'node_modules'])

const collectJavaScriptFiles = (directory) => {
	const files = []

	for (const entry of readdirSync(directory)) {
		if (ignoredDirectories.has(entry)) continue

		const path = join(directory, entry)
		const stats = statSync(path)

		if (stats.isDirectory()) {
			files.push(...collectJavaScriptFiles(path))
		} else if (entry.endsWith('.js')) {
			files.push(path)
		}
	}

	return files
}

const files = collectJavaScriptFiles(process.cwd())
let hasFailure = false

for (const file of files) {
	const result = spawnSync(process.execPath, ['--check', file], {
		stdio: 'inherit',
	})

	if (result.status !== 0) {
		hasFailure = true
	}
}

if (hasFailure) {
	process.exit(1)
}

console.log(`Syntax check passed for ${files.length} JavaScript files.`)
