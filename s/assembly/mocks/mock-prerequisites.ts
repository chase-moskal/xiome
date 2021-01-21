
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {getRando} from "../../toolbox/get-rando.js"
import {dbbyMemory} from "../../toolbox/dbby/dbby-memory.js"
import {mockPlatformConfig} from "../../features/auth/mocks/mock-platform-config.js"

import {SystemTables} from "../types/backend/system-tables.js"

export async function mockPrerequisites() {
	const rando = await getRando()
	const config = mockPlatformConfig({rando})
	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()
	const tables: SystemTables = {
		auth: {
			role: dbbyMemory(),
			account: dbbyMemory(),
			profile: dbbyMemory(),
			userRole: dbbyMemory(),
			privilege: dbbyMemory(),
			rolePrivilege: dbbyMemory(),
			accountViaEmail: dbbyMemory(),
			accountViaGoogle: dbbyMemory(),
			app: dbbyMemory(),
			appToken: dbbyMemory(),
			appOwnership: dbbyMemory(),
		},
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
