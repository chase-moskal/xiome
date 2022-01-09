
import {configureMongo} from "./configurators/configure-mongo.js"
import {prepareBackend} from "./prepare-backend.js"
import {configureDacast} from "./configurators/configure-dacast.js"
import {configureMailgun} from "./configurators/configure-mailgun.js"
import {configureTokenFunctions} from "./configurators/configure-token-functions.js"
import {configureMockFileStorage} from "./configurators/configure-mock-file-storage.js"

export const backendForNode = prepareBackend({
	configureMongo,
	configureDacast,
	configureMailgun,
	configureTokenFunctions,
	configureMockStorage: () => configureMockFileStorage("./mock-database.json"),
})
