
import {asApi} from "renraku/x/identities/as-api"
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {payApi} from "../../features/pay/api/pay-api.js"
import {BackendOptions} from "./types/backend-options.js"
import {makeAuthApi} from "../../features/auth/auth-api.js"
import {mockBrowser} from "../frontend/mocks/mock-browser.js"
import {mockStorageTables} from "./tools/mock-storage-tables.js"
import {mockSendLoginEmail} from "./tools/mock-send-login-email.js"
import {PayTables} from "../../features/pay/api/types/tables/pay-tables.js"
import {mockPlatformConfig} from "../../features/auth/mocks/mock-platform-config.js"
import {AppTables, AuthTables, PermissionsTables} from "../../features/auth/auth-types.js"
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
		app: await mockStorageTables<AppTables>(tableStorage, {
			app: true,
			appOwnership: true,
		}),
		permissions: await mockStorageTables<PermissionsTables>(tableStorage, {
			role: true,
			privilege: true,
			userHasRole: true,
			roleHasPrivilege: true,
		}),
		auth: await mockStorageTables<AuthTables>(tableStorage, {
			account: true,
			profile: true,
			accountViaEmail: true,
			accountViaGoogle: true,
			latestLogin: true,
		}),
		pay: await mockStorageTables<PayTables>(tableStorage, {
			stripeAccounts: true,
			stripeCustomers: true,
			stripePremiums: true,
		}),
	}

	const {fakeSendLoginEmail, getLatestLoginEmail} =
		mockSendLoginEmail(sendLoginEmail)

	const api = asApi({
		auth: makeAuthApi({
			rando,
			config,
			appTables: tables.app,
			authTables: tables.auth,
			permissionsTables: tables.permissions,
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
