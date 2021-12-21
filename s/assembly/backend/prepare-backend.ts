
import {getRando} from "../../toolbox/get-rando.js"
import {SecretConfig} from "./types/secret-config.js"
import {Configurators} from "./types/configurators.js"
import {DamnId} from "../../toolbox/damnedb/damn-id.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {assimilateApi} from "./assimilators/assimilate-api.js"
import {AssimilatorOptions} from "./types/assilimator-options.js"
import {assimilateEmails} from "./assimilators/assimilate-emails.js"
import {assimilateCrypto} from "./assimilators/assimilate-crypto.js"
import {assimilateStripe} from "./assimilators/assimilate-stripe.js"
import {assimilateDacast} from "./assimilators/assimilate-dacast.js"
import {assimilateDatabase} from "./assimilators/assimilate-database.js"
import {makeNotesDepositBox} from "../../features/notes/api/notes-deposit-box.js"

export function prepareBackend(configurators: Configurators) {
	return async function configureApi(config: SecretConfig) {
		const rando = await getRando()
		const options: AssimilatorOptions = {...configurators, config, rando}

		const emails = assimilateEmails(options)

		const {database, mockStorage} = await assimilateDatabase(options)

		const {signToken, verifyToken} = assimilateCrypto(options)

		const {stripeLiaison, mockStripeOperations} = await assimilateStripe({
			...options,
			database,
			mockStorage,
		})

		const dacastSdk = assimilateDacast(options)

		const api = await assimilateApi({
			...options,
			database,
			dacastSdk,
			signToken,
			verifyToken,
			sendLoginEmail: emails.sendLoginEmail,
		})

		return {
			rando,
			api,
			config,
			emails,
			database,
			stripeLiaison,
			mockStripeOperations,
			platformAppId: config.platform.appDetails.appId,
			prepareNotesDepositBox: (appId: DamnId) => makeNotesDepositBox({
				rando,
				notesTables: database.notes.namespaceForApp(appId),
			}),
			mockBrowser: async() => mockBrowser({
				api,
				mockStripeOperations,
				appOrigin: "http://localhost:5000",
			}),
		}
	}
}
