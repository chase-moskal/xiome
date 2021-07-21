
import {FlexStorage} from "../../toolbox/flex-storage/types/flex-storage.js"
import {prepareApiConfigurator} from "./prepare-api-configurator.js"

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

export const configureApiForBrowser = (storage: FlexStorage) => prepareApiConfigurator({
	configureMongo: nope("config.database.mongo not supported in browser"),
	configureMailgun: nope("config.email.mailgun not supported in browser"),
	configureTokenFunctions: nope("config.crypto.keys must be 'mock-mode' in browser"),
	configureMockStorage: () => storage,
})
