
import {asApi} from "renraku/x/identities/as-api.js"
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {BackendOptions} from "./types/backend-options.js"
import {makeAuthApi} from "../../features/auth/auth-api.js"
import {mockPlatformConfig} from "./mock-platform-config.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {storeApi} from "../../features/store/api/store-api.js"
import {mockSendLoginEmail} from "./tools/mock-send-login-email.js"
import {questionsApi} from "../../features/questions/api/questions-api.js"
import {mockAuthTables} from "../../features/auth/tables/mock-auth-tables.js"
import {mockStoreTables} from "../../features/store/api/tables/mock-store-tables.js"
import {mockStripeCircuit} from "../../features/store/stripe2/mocks/mock-stripe-circuit.js"
import {prepareAuthPolicies} from "../../features/auth/policies/prepare-auth-policies.js"
import {mockQuestionsTables} from "../../features/questions/api/tables/mock-questions-tables.js"

export async function mockBackend({
			rando,
			tableStorage,
			platformHome,
			platformLabel,
			technicianEmail,
			sendLoginEmail,
			generateNickname,
		}: BackendOptions) {

	const config = mockPlatformConfig({
		platformHome,
		platformLabel,
		technicianEmail,
	})
	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()

	const authTables = await mockAuthTables(tableStorage)
	const storeTablesSpecifically = await mockStoreTables(tableStorage)
	const questionsTables = await mockQuestionsTables(tableStorage)

	const {fakeSendLoginEmail, getLatestLoginEmail} =
		mockSendLoginEmail(sendLoginEmail)

	const storeTables = {...authTables, ...storeTablesSpecifically}
	const {stripeComplex, mockStripeOperations} =
		await mockStripeCircuit({
			rando,
			tableStorage,
			tables: storeTables,
		})

	const authPolicies = prepareAuthPolicies({
		config,
		tables: authTables,
		verifyToken,
	})

	const api = asApi({
		auth: makeAuthApi({
			rando,
			config,
			authPolicies,
			tables: authTables,
			signToken,
			verifyToken,
			generateNickname,
			sendLoginEmail: fakeSendLoginEmail,
		}),
		store: storeApi({
			rando,
			authPolicies,
			stripeComplex,
			tables: storeTables,
			shoppingOptions: {
				checkoutReturningLinks: {
					cancel: "https://fake.xiome.io/checkout-cancel",
					success: "https://fake.xiome.io/checkout-success",
				},
			},
			stripeConnectOptions: {
				accountReturningLinks: {
					refresh: "https://fake.xiome.io/account-refresh",
					return: "https://fake.xiome.io/account-return",
				},
			},
		}),
		questions: questionsApi({
			rando,
			authPolicies,
			questionsTables,
		})
	})

	return {
		api,
		config,
		tables: {...authTables, ...storeTables},
		platformAppId: config.platform.appDetails.appId,
		stripeComplex,
		mockStripeOperations,
		getLatestLoginEmail,
		mockBrowser: async() => mockBrowser({
			api,
			mockStripeOperations,
		}),
	}
}
