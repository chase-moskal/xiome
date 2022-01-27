
import {configureMongo} from "../configurators/configure-mongo.js"
import {configureDacast} from "../configurators/configure-dacast.js"
import {configureMailgun} from "../configurators/configure-mailgun.js"
import {FlexStorage} from "dbmage"
import {configureTokenFunctions} from "../configurators/configure-token-functions.js"

export interface Configurators {
	configureMongo: typeof configureMongo
	configureMockStorage: () => FlexStorage
	configureMailgun: typeof configureMailgun
	configureTokenFunctions: typeof configureTokenFunctions
	configureDacast: typeof configureDacast
	// configureMockFileStorage: typeof configureMockFileStorage
}
