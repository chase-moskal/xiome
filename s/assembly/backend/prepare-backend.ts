
import {getRando} from "dbmage"
import * as dbmage from "dbmage"

import {DatabaseSafe} from "./types/database.js"
import {SecretConfig} from "./types/secret-config.js"
import {Configurators} from "./types/configurators.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {assimilateApi} from "./assimilators/assimilate-api.js"
import {AssimilatorOptions} from "./types/assilimator-options.js"
import {assimilateEmails} from "./assimilators/assimilate-emails.js"
import {assimilateCrypto} from "./assimilators/assimilate-crypto.js"
import {assimilateStripe} from "./assimilators/assimilate-stripe.js"
import {assimilateDacast} from "./assimilators/assimilate-dacast.js"
import {assimilateDatabase} from "./assimilators/assimilate-database.js"
import {makeNotesDepositBox} from "../../features/notes/api/notes-deposit-box.js"
import {UnconstrainedTable} from "../../framework/api/unconstrained-table.js"

export function prepareBackend(configurators: Configurators) {
	return async function configureApi(config: SecretConfig) {
		const rando = await getRando()
		const options: AssimilatorOptions = {...configurators, config, rando}

		const emails = assimilateEmails(options)
		const {databaseRaw, mockStorage} = await assimilateDatabase(options)
		const {signToken, verifyToken} = assimilateCrypto(options)

		const {stripeLiaison, mockStripeOperations} = await assimilateStripe({
			...options,
			databaseRaw,
			mockStorage,
		})

		const dacastSdk = assimilateDacast(options)

		const api = await assimilateApi({
			...options,
			dacastSdk,
			databaseRaw,
			signToken,
			verifyToken,
			sendLoginEmail: emails.sendLoginEmail,
		})

		return {
			rando,
			api,
			config,
			emails,
			databaseRaw,
			stripeLiaison,
			mockStripeOperations,
			platformAppId: config.platform.appDetails.appId,
			prepareNotesDepositBox: (appId: dbmage.Id) => makeNotesDepositBox({
				rando,
				database: <DatabaseSafe>UnconstrainedTable.constrainDatabaseForApp({
					appId,
					database: databaseRaw,
				}),
			}),
			mockBrowser: async({appOrigin}: {appOrigin: string}) => mockBrowser({
				api,
				appOrigin,
				mockStripeOperations,
			}),
		}
	}
}
