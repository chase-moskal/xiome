
import {prepareBackend} from "./prepare-backend.js"
import {FlexStorage} from "dbmage"

class ConfigNotSupportedInBrowserError extends Error {
	constructor(message: string) {
		super(message)
	}
}

function nope(message: string) {
	return function() {
		throw new ConfigNotSupportedInBrowserError(message)
	}
}

export const backendForBrowser = (storage: FlexStorage) => prepareBackend({
	configureMongo: nope("config.database.mongo not supported in browser"),
	configureMailgun: nope("config.email.mailgun not supported in browser"),
	configureTokenFunctions: nope("config.crypto.keys must be 'mock-mode' in browser"),
	configureMockStorage: () => storage,
	configureDacast: nope("config.dacast must be in 'mock-mode' in browser"),
})
