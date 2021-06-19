
import {asApi} from "renraku/x/identities/as-api.js"
import {makeNodeHttpServer} from "renraku/x/server/make-node-http-server.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {getRando} from "./toolbox/get-rando.js"
import {dbbyMongo} from "./toolbox/dbby/dbby-mongo.js"
import {makeAuthApi} from "./features/auth/auth-api.js"
import {minute, day} from "./toolbox/goodtimes/times.js"
import {AuthTables} from "./features/auth/tables/types/auth-tables.js"
import {questionsApi} from "./features/questions/api/questions-api.js"
import {prepareAuthPolicies} from "./features/auth/policies/prepare-auth-policies.js"
import {prepareSendLoginEmail} from "./features/auth/tools/emails/send-login-email.js"
import {makeAdministrativeApi} from "./features/administrative/api/administrative-api.js"
import {QuestionsTables} from "./features/questions/api/tables/types/questions-tables.js"
import {standardNicknameGenerator} from "./features/auth/tools/nicknames/standard-nickname-generator.js"

import {dbbyMemory} from "./toolbox/dbby/dbby-memory.js"
import {SendEmail} from "./features/auth/types/emails/send-email.js"
import {SecretConfig} from "./assembly/backend/types/secret-config.js"
import {loginEmailRecaller} from "./assembly/backend/tools/login-email-recaller.js"
import {makeEmailController} from "./assembly/frontend/connect/mock/common/email-controller.js"

const port = 80

type Database = {
	authTables: AuthTables
	questionsTables: QuestionsTables
}

async function configureApi(config: SecretConfig) {
	const rando = await getRando()

	//
	// emails
	//

	const emailController = await (async() => {
		let sendEmail: SendEmail

		if (config.email === "mock-console") {
			const mock = await import("./features/auth/tools/emails/mock-send-email.js")
			sendEmail = mock.sendEmail
		}
		else {
			const {default: sendgridMail} = await import("./commonjs/sendgrid-mail.js")
			const {apiKey} = config.email.sendgrid
			sendgridMail.setApiKey(apiKey)
			sendEmail = async({to, body, subject}) => {
				await sendgridMail.send({
					to,
					subject,
					from: config.platform.from,
					text: body,
				})
			}
		}

		return makeEmailController(sendEmail)
	})()

	//
	// database
	//

	const database: Database = await (async() => {
		if (config.database === "mock-memory") {
			return <Database>{
				authTables: {
					app: {
						app: await dbbyMemory(),
						appOwnership: await dbbyMemory(),
					},
					permissions: {
						privilege: await dbbyMemory(),
						role: await dbbyMemory(),
						roleHasPrivilege: await dbbyMemory(),
						userHasRole: await dbbyMemory(),
					},
					user: {
						account: await dbbyMemory(),
						accountViaEmail: await dbbyMemory(),
						accountViaGoogle: await dbbyMemory(),
						latestLogin: await dbbyMemory(),
						profile: await dbbyMemory(),
					},
				},
				questionsTables: <QuestionsTables>{
					questionLikes: await dbbyMemory(),
					questionPosts: await dbbyMemory(),
					questionReports: await dbbyMemory(),
				},
			}
		}
		else if (config.database === "mock-file") {
			throw new Error("unimplemented: database mock-file")
		}
		else {
			const {MongoClient} = await import("mongodb")
			const mongo = new MongoClient(config.database.mongo.link)
			const db = mongo.db(config.database.mongo.db)
			return <Database>{
				authTables: {
					app: {
						app: dbbyMongo({collection: db.collection("core-app-app")}),
						appOwnership: dbbyMongo({collection: db.collection("core-app-appOwnership")}),
					},
					permissions: {
						privilege: dbbyMongo({collection: db.collection("core-permissions-privilege")}),
						role: dbbyMongo({collection: db.collection("core-permissions-role")}),
						roleHasPrivilege: dbbyMongo({collection: db.collection("core-permissions-roleHasPrivilege")}),
						userHasRole: dbbyMongo({collection: db.collection("core-permissions-userHasRole")}),
					},
					user: {
						account: dbbyMongo({collection: db.collection("core-user-account")}),
						accountViaEmail: dbbyMongo({collection: db.collection("core-user-accountViaEmail")}),
						accountViaGoogle: dbbyMongo({collection: db.collection("core-user-accountViaGoogle")}),
						latestLogin: dbbyMongo({collection: db.collection("core-user-latestLogin")}),
						profile: dbbyMongo({collection: db.collection("core-user-profile")}),
					},
				},
				questionsTables: {
					questionLikes: dbbyMongo({collection: db.collection("questions-questionLikes")}),
					questionPosts: dbbyMongo({collection: db.collection("questions-questionPosts")}),
					questionReports: dbbyMongo({collection: db.collection("questions-questionReports")}),
				}
			}
		}
	})()

	//
	// crypto
	//

	const {signToken, verifyToken} = await (async() => {
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
	// api
	//

	const {api, recallLatestLoginEmail} = await (async() => {
		const generateNickname = standardNicknameGenerator({rando})
		const {sendLoginEmail, recallLatestLoginEmail} = loginEmailRecaller(
			prepareSendLoginEmail({sendEmail})
		)

		const authPolicies = prepareAuthPolicies({
			config,
			tables: database.authTables,
			verifyToken,
		})

		const api = asApi({
			auth: makeAuthApi({
				rando,
				config,
				authPolicies,
				tables: database.authTables,
				signToken,
				verifyToken,
				generateNickname,
				sendLoginEmail,
			}),
			administrative: makeAdministrativeApi({
				config,
				authTables: database.authTables,
				authPolicies,
			}),
			questionsApi: questionsApi({
				rando,
				config,
				authPolicies,
				questionsTables: database.questionsTables,
			}),
		})

		return {api, recallLatestLoginEmail}
	})()

	return {
		api,
		emailController,
		recallLatestLoginEmail,
	}
}

void async function main() {
	console.log("starting xiome server")

	const config: SecretConfig = {
		server: {
			port: 4999,
		},
		email: "mock-console",
		database: "mock-memory",
		stripe: "mock-mode",
		platform: {
			from: "hello@xiome.io",
			technician: {
				email: "chasemoskal@gmail.com",
			},
			appDetails: {
				appId: "7nsgfgbP8PqcgNYk9hYxWdDcznTxndqpBG7WJDD9rpyCXHJg",
				label: "Xiome Cloud",
				home: "https://xiome.io/",
				origins: [
					"https://xiome.io",
				],
			},
		},
		crypto: {
			keys: "mock-mode",
			tokenLifespans: {
				login: 5 * minute,
				refresh: 30 * day,
				access: 5 * minute,
				external: 5 * minute,
			},
		},
	}

	const {api} = await configureApi(config)
	console.log(`🎟️ platform app id: ${config.platform.appDetails.appId}`)

	const servelet = makeJsonHttpServelet(api)
	const server = makeNodeHttpServer(servelet)

	server.listen(port)
	console.log(`📡 listening on port ${port}`)
}()
