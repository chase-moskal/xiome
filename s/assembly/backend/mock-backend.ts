
import {asApi} from "renraku/x/identities/as-api"
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {payApi} from "../../features/pay/api/pay-api.js"
import {BackendOptions} from "./types/backend-options.js"
import {makeAuthApi} from "../../features/auth/auth-api.js"
import {AuthTables} from "../../features/auth/auth-types.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {mockStorageTables} from "./tools/mock-storage-tables.js"
import {mockSendLoginEmail} from "./tools/mock-send-login-email.js"
import {PayTables} from "../../features/pay/api/types/tables/pay-tables.js"
import {mockStripeLiaison} from "../../features/pay/stripe/mocks/mock-stripe-liaison.js"
import {mockPlatformConfig} from "../../features/auth/mocks/mock-platform-config.js"
import {prepareStripeLiaison} from "../../features/pay/stripe/prepare-stripe-liaison.js"
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

	const tables = {
		auth: await mockStorageTables<AuthTables>(tableStorage, {
			role: true,
			account: true,
			profile: true,
			privilege: true,
			userHasRole: true,
			accountViaEmail: true,
			accountViaGoogle: true,
			roleHasPrivilege: true,
			app: true,
			appOwnership: true,
			latestLogin: true,
		}),
		pay: await mockStorageTables<PayTables>(tableStorage, {
			stripeAccounts: true,
			stripeCustomers: true,
			stripePremiums: true,
		}),
	}

	const {fakeSendLoginEmail, getLatestLoginEmail} = mockSendLoginEmail(
		sendLoginEmail
	)

	const api = asApi({
		auth: makeAuthApi({
			rando,
			config,
			authTables: tables.auth,
			signToken,
			verifyToken,
			generateNickname,
			sendLoginEmail: fakeSendLoginEmail,
		}),
		pay: payApi({
			rando,
			rawPayTables: tables.pay,
			verifyToken,
			makeStripeLiaison: prepareMockStripeLiaison({rando}),
		}),
	})

	return {
		api,
		config,
		tables,
		platformAppId: config.platform.appDetails.appId,
		getLatestLoginEmail,
		mockBrowser: async() => mockBrowser({api}),
	}
}
