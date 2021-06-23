
import {asApi} from "renraku/x/identities/as-api.js"

import {Database} from "./types/database.js"
import {dbbyX} from "../../toolbox/dbby/dbby-x.js"
import {waitForProperties} from "./tools/zippy.js"
import {getRando} from "../../toolbox/get-rando.js"
import {SecretConfig} from "./types/secret-config.js"
import {dbbyMongo} from "../../toolbox/dbby/dbby-mongo.js"
import {makeAuthApi} from "../../features/auth/auth-api.js"
import {processBlueprint} from "./tools/process-blueprint.js"
import {loginEmailRecaller} from "./tools/login-email-recaller.js"
import {BlueprintForTables} from "./types/blueprint-for-tables.js"
import {SendEmail} from "../../features/auth/types/emails/send-email.js"
import {questionsApi} from "../../features/questions/api/questions-api.js"
import {FlexStorage} from "../../toolbox/flex-storage/types/flex-storage.js"
import {makeEmailEnabler} from "../frontend/connect/mock/common/email-enabler.js"
import {memoryFlexStorage} from "../../toolbox/flex-storage/memory-flex-storage.js"
import {simpleFlexStorage} from "../../toolbox/flex-storage/simple-flex-storage.js"
import {prepareAuthPolicies} from "../../features/auth/policies/prepare-auth-policies.js"
import {prepareSendLoginEmail} from "../../features/auth/tools/emails/send-login-email.js"
import {mockStripeCircuit} from "../../features/store/stripe2/mocks/mock-stripe-circuit.js"
import {makeAdministrativeApi} from "../../features/administrative/api/administrative-api.js"
import {standardNicknameGenerator} from "../../features/auth/tools/nicknames/standard-nickname-generator.js"

export async function configureApi(config: SecretConfig) {
	const rando = await getRando()

	//
	// emails
	//
	const emails = await (async () => {
		let sendEmail: SendEmail

		if (config.email === "mock-console") {
			const mock = await import("../../features/auth/tools/emails/mock-send-email.js")
			sendEmail = mock.sendEmail
		}
		else {
			const {default: sendgridMail} = await import("../../commonjs/sendgrid-mail.js")
			const {apiKey} = config.email.sendgrid
			sendgridMail.setApiKey(apiKey)
			sendEmail = async ({to, body, subject}) => {
				await sendgridMail.send({
					to,
					subject,
					from: config.platform.from,
					text: body,
				})
			}
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
				const {nodeFileFlexStorage} = await import("../../toolbox/flex-storage/node-file-flex-storage.js")
				return mockWithStorage(nodeFileFlexStorage("./data.json"))
			}
			case "mock-memory": {
				return mockWithStorage(memoryFlexStorage())
			}
			case "mock-localstorage": {
				return mockWithStorage(simpleFlexStorage(window.localStorage))
			}
			default: {
				const {MongoClient} = await import("mongodb")
				const mongo = new MongoClient(config.database.mongo.link)
				const db = mongo.db(config.database.mongo.db)
				return {
					mockStorage: memoryFlexStorage(),
					database: <Database>processBlueprint({
						blueprint,
						process: path => dbbyMongo({
							collection: db.collection(path.join("-")),
						}),
					})
				}
			}
		}
	})()

	//
	// crypto
	//
	const {signToken, verifyToken} = await (async () => {
		if (config.crypto.keys === "mock-mode") {
			const {mockSignToken} = await import("redcrypto/dist/curries/mock-sign-token.js")
			const {mockVerifyToken} = await import("redcrypto/dist/curries/mock-verify-token.js")
			return {
				signToken: mockSignToken(),
				verifyToken: mockVerifyToken(),
			}
		}
		else {
			const {currySignToken} = await import("redcrypto/dist/curries/curry-sign-token.js")
			const {curryVerifyToken} = await import("redcrypto/dist/curries/curry-verify-token.js")
			return {
				signToken: currySignToken(config.crypto.keys.private),
				verifyToken: curryVerifyToken(config.crypto.keys.public),
			}
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
		emails,
		database,
		stripeComplex,
		mockStripeOperations,
	}
}
