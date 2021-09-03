
import {asApi} from "renraku/x/identities/as-api.js"
import {mockSignToken} from "redcrypto/x/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

import {dbbyX} from "../../toolbox/dbby/dbby-x.js"
import {waitForProperties} from "./tools/zippy.js"
import {getRando} from "../../toolbox/get-rando.js"
import {SecretConfig} from "./types/secret-config.js"
import {objectMap} from "../../toolbox/object-map.js"
import {DamnId} from "../../toolbox/damnedb/damn-id.js"
import {authApi} from "../../features/auth/auth-api.js"
import {dbbyMemory} from "../../toolbox/dbby/dbby-memory.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {processBlueprint} from "./tools/process-blueprint.js"
import {dbbyHardback} from "../../toolbox/dbby/dbby-hardback.js"
import {configureMongo} from "./configurators/configure-mongo.js"
import {loginEmailRecaller} from "./tools/login-email-recaller.js"
import {BlueprintForTables} from "./types/blueprint-for-tables.js"
import {DatabaseNamespaced, DatabaseRaw} from "./types/database.js"
import {SendEmail} from "../../features/auth/types/emails/send-email.js"
import {questionsApi} from "../../features/questions/api/questions-api.js"
import {FlexStorage} from "../../toolbox/flex-storage/types/flex-storage.js"
import {configureMailgun} from "../backend/configurators/configure-mailgun.js"
import {makeEmailEnabler} from "../frontend/connect/mock/common/email-enabler.js"
import {mockSendEmail} from "../../features/auth/utils/emails/mock-send-email.js"
import {originsToDatabase} from "../../features/auth/utils/origins-to-database.js"
import {configureTokenFunctions} from "./configurators/configure-token-functions.js"
import {AppRegistrationRow} from "../../features/auth/aspects/apps/types/app-tables.js"
import {prepareAuthPolicies} from "../../features/auth/policies/prepare-auth-policies.js"
import {prepareSendLoginEmail} from "../../features/auth/utils/emails/send-login-email.js"
import {mockStripeCircuit} from "../../features/store/stripe2/mocks/mock-stripe-circuit.js"
import {makeAdministrativeApi} from "../../features/administrative/api/administrative-api.js"
import {Unconstrain, UnconstrainedTables} from "../../framework/api/types/table-namespacing-for-apps.js"
import {standardNicknameGenerator} from "../../features/auth/utils/nicknames/standard-nickname-generator.js"
import {exampleApi} from "../../features/example/api/example-api.js"
import {livestreamApi} from "../../features/livestream/api/livestream-api.js"

export function prepareApiConfigurator(configurators: {
		configureMongo: typeof configureMongo
		configureMailgun: typeof configureMailgun
		configureTokenFunctions: typeof configureTokenFunctions
		configureMockStorage: () => FlexStorage
		// configureMockFileStorage: typeof configureMockFileStorage
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
				database: DatabaseRaw & Unconstrain<DatabaseNamespaced>
				mockStorage: FlexStorage
			}> => {

			const blueprintForRawDatabase: BlueprintForTables<DatabaseRaw> = {
				apps: {
					registrations: true,
					owners: true,
				},
			}

			const blueprintForNamespacedDatabase: BlueprintForTables<DatabaseNamespaced> = {
				auth: {
					users: {
						accounts: true,
						emails: true,
						latestLogins: true,
						profiles: true,
					},
					permissions: {
						privilege: true,
						role: true,
						roleHasPrivilege: true,
						userHasRole: true,
					},
				},
				example: {
					examplePosts: true,
				},
				questions: {
					likes: true,
					reports: true,
					answerPosts: true,
					questionPosts: true,
				},
				livestream: {
					shows: true,
				},
				store: {
					billing: {
						customers: true,
						storeInfo: true,
						subscriptionPlans: true,
						subscriptions: true,
					},
					merchant: {
						stripeAccounts: true,
					},
				},
			}

			async function mockWithStorage(mockStorage: FlexStorage) {
				const databaseRaw = <DatabaseRaw>await waitForProperties(
					processBlueprint({
						blueprint: blueprintForRawDatabase,
						process: path => dbbyX(mockStorage, path.join("-")),
					})
				)
				const databaseUnconstrained = await (async() => {
					const databaseNamespaced = <DatabaseNamespaced>await waitForProperties(
						processBlueprint({
							blueprint: blueprintForNamespacedDatabase,
							process: path => dbbyX(mockStorage, path.join("-")),
						})
					)
					return <Unconstrain<DatabaseNamespaced>>objectMap(
						databaseNamespaced,
						value => new UnconstrainedTables(value),
					)
				})()
				return {
					mockStorage,
					database: {
						...databaseRaw,
						...databaseUnconstrained,
					}
				}
			}

			const results = config.database === "mock-storage"
				? await mockWithStorage(configurators.configureMockStorage())
				: await configurators.configureMongo({
					blueprintForRawDatabase,
					blueprintForNamespacedDatabase,
					config: {...config, database: config.database},
				})

			const bakedAppTables = await (async() => {
				const platformApp = config.platform.appDetails
				const {apps: appTables} = results.database
				return <typeof appTables>{
					...appTables,
					registrations: dbbyHardback({
						frontTable: appTables.registrations,
						backTable: await dbbyMemory<AppRegistrationRow>([
							{
								appId: DamnId.fromString(platformApp.appId),
								home: platformApp.home,
								label: platformApp.label,
								origins: originsToDatabase(platformApp.origins),
								archived: false,
							}
						])
					}),
				}
			})()

			return {
				database: {
					...results.database,
					apps: bakedAppTables,
				},
				mockStorage: results.mockStorage
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
			authTables: database.auth,
			storeTables: database.store,
		})

		//
		// api
		//
		const api = await (async () => {
			const generateNickname = standardNicknameGenerator({rando})

			const authPolicies = prepareAuthPolicies({
				config,
				appTables: database.apps,
				authTables: database.auth,
				verifyToken,
			})

			return asApi({
				auth: authApi({
					rando,
					config,
					authPolicies,
					signToken,
					verifyToken,
					generateNickname,
					sendLoginEmail: emails.sendLoginEmail,
				}),
				administrative: makeAdministrativeApi({
					config,
					authPolicies,
				}),
				questions: questionsApi({
					rando,
					config,
					authPolicies,
					questionsTables: database.questions,
				}),
				example: exampleApi({
					rando,
					config,
					authPolicies,
					exampleTables: database.example,
				}),
				livestream: livestreamApi({
					authPolicies,
					livestreamTables: database.livestream,
				})
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
