
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {getRando} from "../../toolbox/get-rando.js"
import {SimpleStorage} from "../../toolbox/json-storage.js"
import {mockStorageTables} from "./tools/mock-storage-tables.js"
import {mockPlatformConfig} from "../../features/auth/mocks/mock-platform-config.js"

import {SystemTables} from "../types/backend/system-tables.js"

export async function mockPrerequisites({
		tableStorage,
		platformLink,
		technicianEmail,
		platformAppLabel,
	}: {
		platformLink: string
		technicianEmail: string
		platformAppLabel: string
		tableStorage: SimpleStorage
	}) {

	const rando = await getRando()
	const config = mockPlatformConfig({
		rando,
		platformLink,
		technicianEmail,
		platformAppLabel,
	})
	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()

	const tables: SystemTables = {
		auth: mockStorageTables(tableStorage, {
			role: true,
			account: true,
			profile: true,
			userRole: true,
			privilege: true,
			rolePrivilege: true,
			accountViaEmail: true,
			accountViaGoogle: true,
			app: true,
			appToken: true,
			appOwnership: true,
		}),
	}

	let nicknameCount = 0
	const generateNickname = () => `Anonymous ${nicknameCount++}`

	return {
		rando,
		config,
		tables,
		signToken,
		verifyToken,
		generateNickname,
	}
}
