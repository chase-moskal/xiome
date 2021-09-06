
import {configureMongo} from "../configurators/configure-mongo.js"
import {configureMailgun} from "../configurators/configure-mailgun.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {configureTokenFunctions} from "../configurators/configure-token-functions.js"

export interface Configurators {
	configureMongo: typeof configureMongo
	configureMockStorage: () => FlexStorage
	configureMailgun: typeof configureMailgun
	configureTokenFunctions: typeof configureTokenFunctions
	// configureMockFileStorage: typeof configureMockFileStorage
}
