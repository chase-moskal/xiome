
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

import {getRando} from "../../toolbox/get-rando.js"
import {mockConfig} from "../../assembly/backend/config/mock-config.js"
import {mockDatabase} from "../../assembly/backend/database/mock-database.js"
import {memoryFlexStorage} from "../../toolbox/flex-storage/memory-flex-storage.js"
import {prepareAuthPolicies} from "../../features/auth/policies/prepare-auth-policies.js"

export async function prepareMockAuth() {
	const rando = await getRando()
	const appId = rando.randomId2()
	const appOrigin = "chasemoskal.com"
	const config = mockConfig({
		platformHome: `https://xiome.io/`,
		platformOrigins: ["xiome.io"],
	})

	const storage = memoryFlexStorage()
	const databaseRaw = mockDatabase(storage)

	const authPolicies = prepareAuthPolicies({
		config,
		databaseRaw,
		verifyToken: mockVerifyToken(),
	})

	return {
		appId,
		rando,
		config,
		storage,
		appOrigin,
		databaseRaw,
		authPolicies,
	}
}
