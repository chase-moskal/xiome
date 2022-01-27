
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

import {getRando} from "dbmage"
import {mockConfig} from "../../assembly/backend/config/mock-config.js"
import {mockDatabase} from "../../assembly/backend/database/mock-database.js"
import {memoryFlexStorage} from "dbmage"
import {prepareAuthPolicies} from "../../features/auth/policies/prepare-auth-policies.js"

export async function prepareMockAuth() {
	const rando = await getRando()
	const appId = rando.randomId()
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
