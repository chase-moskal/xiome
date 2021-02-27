
import {asApi} from "renraku/x/identities/as-api"
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {payApi} from "../../features/pay/api/pay-api.js"
import {BackendOptions} from "./types/backend-options.js"
import {makeAuthApi} from "../../features/auth/auth-api.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {mockSendLoginEmail} from "./tools/mock-send-login-email.js"
import {mockAuthTables} from "../../features/auth/tables/mock-auth-tables.js"
import {mockPlatformConfig} from "../../features/auth/mocks/mock-platform-config.js"
import {prepareMockStripeLiaison} from "../../features/pay/stripe/prepare-mock-stripe-liaison.js"

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

	const {fakeSendLoginEmail, getLatestLoginEmail} =
		mockSendLoginEmail(sendLoginEmail)

	const api = asApi({
		auth: makeAuthApi({
			rando,
			config,
			authTables,
			signToken,
			verifyToken,
			generateNickname,
			sendLoginEmail: fakeSendLoginEmail,
		}),
		pay: payApi({
			rando,
			rawPayTables: authTables.pay,
			verifyToken,
			makeStripeLiaison: prepareMockStripeLiaison({rando}),
		}),
	})

	return {
		api,
		config,
		authTables,
		platformAppId: config.platform.appDetails.appId,
		getLatestLoginEmail,
		mockBrowser: async() => mockBrowser({api}),
	}
}
