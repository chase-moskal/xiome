
import {getRando} from "../../toolbox/get-rando.js"
import {SecretConfig} from "./types/secret-config.js"
import {Configurators} from "./types/configurators.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {assimilateApi} from "./assimilators/assimilate-api.js"
import {AssimilatorOptions} from "./types/assilimator-options.js"
import {assimilateEmails} from "./assimilators/assimilate-emails.js"
import {assimilateCrypto} from "./assimilators/assimilate-crypto.js"
import {assimilateStripe} from "./assimilators/assimilate-stripe.js"
import {assimilateDatabase} from "./assimilators/assimilate-database.js"

export function prepareBackend(configurators: Configurators) {
	return async function configureApi(config: SecretConfig) {
		const rando = await getRando()
		const options: AssimilatorOptions = {...configurators, config, rando}

		const emails = assimilateEmails(options)

		const {database, mockStorage} = await assimilateDatabase(options)

		const {signToken, verifyToken} = assimilateCrypto(options)

		const {stripeComplex, mockStripeOperations} = await assimilateStripe({
			...options,
			database,
			mockStorage,
		})

		const api = await assimilateApi({
			...options,
			database,
			signToken,
			verifyToken,
			sendLoginEmail: emails.sendLoginEmail,
		})

		return {
			api,
			config,
			emails,
			database,
			stripeComplex,
			mockStripeOperations,
			platformAppId: config.platform.appDetails.appId,
			mockBrowser: async() => mockBrowser({
				api,
				mockStripeOperations,
			}),
		}
	}
}
