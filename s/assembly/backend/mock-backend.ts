
import {asApi} from "renraku/x/identities/as-api.js"
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {storeApi} from "../../features/store/api/store-api.js"
import {BackendOptions} from "./types/backend-options.js"
import {makeAuthApi} from "../../features/auth/auth-api.js"
import {mockPlatformConfig} from "./mock-platform-config.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {mockSendLoginEmail} from "./tools/mock-send-login-email.js"
import {mockAuthTables} from "../../features/auth/tables/mock-auth-tables.js"
import {mockStoreTables} from "../../features/store/api/tables/mock-store-tables.js"
import {prepareMockStripeComplex} from "../../features/store/stripe/prepare-mock-stripe-complex.js"

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

	const {fakeSendLoginEmail, getLatestLoginEmail} =
		mockSendLoginEmail(sendLoginEmail)

	const storeTables = {...authTables, ...storeTablesSpecifically}

	const mockStripeLiaison = prepareMockStripeComplex({rando, tableStorage})
	const {mockStripeOperations} = await mockStripeLiaison({tables: storeTables})

	const api = asApi({
		auth: makeAuthApi({
			rando,
			config,
			tables: authTables,
			signToken,
			verifyToken,
			generateNickname,
			sendLoginEmail: fakeSendLoginEmail,
		}),
		store: storeApi({
			rando,
			config,
			tables: {...authTables, ...storeTablesSpecifically},
			verifyToken,
			makeStripeLiaison: async({tables}) => {
				const {stripeLiaison} = await mockStripeLiaison({tables})
				return stripeLiaison
			}
		}),
	})

	return {
		api,
		config,
		tables: {...authTables, ...storeTablesSpecifically},
		platformAppId: config.platform.appDetails.appId,
		mockStripeOperations,
		getLatestLoginEmail,
		mockBrowser: async() => mockBrowser({api, mockStripeOperations}),
	}
}
