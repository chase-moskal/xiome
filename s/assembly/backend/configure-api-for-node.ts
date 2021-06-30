
import {configureMongo} from "./configurators/configure-mongo.js"
import {prepareApiConfigurator} from "./prepare-api-configurator.js"
import {configureMailgun} from "./configurators/configure-mailgun.js"
import {configureTokenFunctions} from "./configurators/configure-token-functions.js"
import {configureMockFileStorage} from "./configurators/configure-mock-file-storage.js"

export const configureApiForNode = prepareApiConfigurator({
	configureMongo,
	configureMailgun,
	configureTokenFunctions,
	configureMockFileStorage,
})
