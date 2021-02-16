
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {Rando} from "../../toolbox/get-rando.js"
import {mockStorageTables} from "./tools/mock-storage-tables.js"
import {FlexStorage} from "../../toolbox/flex-storage/types/flex-storage.js"
import {mockPlatformConfig} from "../../features/auth/mocks/mock-platform-config.js"

import {SystemTables} from "./types/system-tables.js"

export async function mockPrerequisites({
		rando,
		tableStorage,
		platformHome,
		platformLabel,
		technicianEmail,
	}: {
		rando: Rando
		platformHome: string
		platformLabel: string
		technicianEmail: string
		tableStorage: FlexStorage
	}) {

	const config = mockPlatformConfig({
		platformHome,
		platformLabel,
		technicianEmail,
	})
	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()

	const tables: SystemTables = {
		auth: await mockStorageTables<SystemTables["auth"]>(tableStorage, {
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
	}

	return {
		rando,
		config,
		tables,
		signToken,
		verifyToken,
	}
}
