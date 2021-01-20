
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token"
import {getRando} from "../../toolbox/get-rando.js"
import {SystemTables} from "../types/backend/system-tables.js"
import {dbbyMemory} from "../../toolbox/dbby/dbby-memory.js"
import {mockPlatformConfig} from "../../features/auth/mocks/mock-platform-config.js"

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
	return {
		rando,
		config,
		tables,
		signToken,
		verifyToken,
	}
}
