
import {FlexStorage} from "dbmage"

import {configureMongo} from "../configurators/configure-mongo.js"
import {configureDacast} from "../configurators/configure-dacast.js"
import {configureStripe} from "../configurators/configure-stripe.js"
import {configureMailgun} from "../configurators/configure-mailgun.js"
import {configureTokenFunctions} from "../configurators/configure-token-functions.js"

export interface Configurators {
	configureMongo: typeof configureMongo
	configureMockStorage: () => FlexStorage
	configureMailgun: typeof configureMailgun
	configureTokenFunctions: typeof configureTokenFunctions
	configureDacast: typeof configureDacast
	configureStripe: typeof configureStripe
	// configureMockFileStorage: typeof configureMockFileStorage
}
