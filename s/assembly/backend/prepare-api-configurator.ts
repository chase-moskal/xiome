
import {asApi} from "renraku/x/identities/as-api.js"
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {Database} from "./types/database.js"
import {dbbyX} from "../../toolbox/dbby/dbby-x.js"
import {waitForProperties} from "./tools/zippy.js"
import {getRando} from "../../toolbox/get-rando.js"
import {SecretConfig} from "./types/secret-config.js"
import {makeAuthApi} from "../../features/auth/auth-api.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {processBlueprint} from "./tools/process-blueprint.js"
import {configureMongo} from "./configurators/configure-mongo.js"
import {loginEmailRecaller} from "./tools/login-email-recaller.js"
import {BlueprintForTables} from "./types/blueprint-for-tables.js"
import {SendEmail} from "../../features/auth/types/emails/send-email.js"
import {questionsApi} from "../../features/questions/api/questions-api.js"
import {FlexStorage} from "../../toolbox/flex-storage/types/flex-storage.js"
import {configureMailgun} from "../backend/configurators/configure-mailgun.js"
import {makeEmailEnabler} from "../frontend/connect/mock/common/email-enabler.js"
import {memoryFlexStorage} from "../../toolbox/flex-storage/memory-flex-storage.js"
import {simpleFlexStorage} from "../../toolbox/flex-storage/simple-flex-storage.js"
import {configureTokenFunctions} from "./configurators/configure-token-functions.js"
import {configureMockFileStorage} from "./configurators/configure-mock-file-storage.js"
import {prepareAuthPolicies} from "../../features/auth/policies/prepare-auth-policies.js"
import {prepareSendLoginEmail} from "../../features/auth/tools/emails/send-login-email.js"
import {mockStripeCircuit} from "../../features/store/stripe2/mocks/mock-stripe-circuit.js"
import {makeAdministrativeApi} from "../../features/administrative/api/administrative-api.js"
import {sendEmail as mockSendEmail} from "../../features/auth/tools/emails/mock-send-email.js"
import {standardNicknameGenerator} from "../../features/auth/tools/nicknames/standard-nickname-generator.js"

export function prepareApiConfigurator(configurators: {
		configureMongo: typeof configureMongo
		configureMailgun: typeof configureMailgun
		configureTokenFunctions: typeof configureTokenFunctions
		configureMockFileStorage: typeof configureMockFileStorage
	}) {

	return async function configureApi(config: SecretConfig) {
		const rando = await getRando()

		//
		// emails
		//
		const emails = await (async () => {
			let sendEmail: SendEmail

			if (config.email === "mock-console") {
				sendEmail = mockSendEmail
			}
			else {
				sendEmail = configurators
					.configureMailgun(config.email)
					.sendEmail
			}

			const enabler = makeEmailEnabler(sendEmail)
			sendEmail = enabler.sendEmail
			const {disableEmails, enableEmails} = enabler

			const {sendLoginEmail, recallLatestLoginEmail} = loginEmailRecaller(
				prepareSendLoginEmail({sendEmail})
			)

			return {
				sendEmail,
				enableEmails,
				disableEmails,
				sendLoginEmail,
				recallLatestLoginEmail,
			}
		})()

		//
		// database
		//
		const {database, mockStorage} = await (async (): Promise<{
				database: Database
				mockStorage: FlexStorage
			}> => {

			const blueprint: BlueprintForTables<Database> = {
				core: {
					app: {
						app: true,
						appOwnership: true,
					},
					permissions: {
						privilege: true,
						role: true,
						roleHasPrivilege: true,
						userHasRole: true,
					},
					user: {
						account: true,
						accountViaEmail: true,
						accountViaGoogle: true,
						latestLogin: true,
						profile: true,
					},
				},
				questions: {
					questionLikes: true,
					questionPosts: true,
					questionReports: true,
				},
				store: {
					billing: {
						customers: true,
						storeInfo: true,
						subscriptions: true,
						subscriptionPlans: true,
					},
					merchant: {
						stripeAccounts: true,
					},
				},
			}

			async function mockWithStorage(mockStorage: FlexStorage) {
				return {
					mockStorage,
					database: <Database>await waitForProperties(
						processBlueprint({
							blueprint,
							process: path => dbbyX(mockStorage, path.join("-")),
						})
					)
				}
			}

			switch (config.database) {
				case "mock-file": {
					return mockWithStorage(configurators.configureMockFileStorage("./data.json"))
				}
				case "mock-memory": {
					return mockWithStorage(memoryFlexStorage())
				}
				case "mock-localstorage": {
					return mockWithStorage(simpleFlexStorage(window.localStorage))
				}
				default: {
					return configurators.configureMongo({
						blueprint,
						config: {...config, database: config.database},
					})
				}
			}
		})()

		//
		// crypto
		//
		const {signToken, verifyToken} = await (async () => {
			if (config.crypto.keys === "mock-mode") {
				return {
					signToken: mockSignToken(),
					verifyToken: mockVerifyToken(),
				}
			}
			else {
				return configurators.configureTokenFunctions(config.crypto.keys)
			}
		})()

		//
		// stripe
		//
		const {stripeComplex, mockStripeOperations} = await mockStripeCircuit({
			rando,
			tableStorage: mockStorage,
			tables: {...database.core, ...database.store},
		})

		//
		// api
		//
		const api = await (async () => {
			const generateNickname = standardNicknameGenerator({rando})

			const authPolicies = prepareAuthPolicies({
				config,
				tables: database.core,
				verifyToken,
			})

			return asApi({
				auth: makeAuthApi({
					rando,
					config,
					authPolicies,
					tables: database.core,
					signToken,
					verifyToken,
					generateNickname,
					sendLoginEmail: emails.sendLoginEmail,
				}),
				administrative: makeAdministrativeApi({
					config,
					authTables: database.core,
					authPolicies,
				}),
				questions: questionsApi({
					rando,
					config,
					authPolicies,
					questionsTables: database.questions,
				}),
			})
		})()

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
