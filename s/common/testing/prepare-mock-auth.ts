
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

import {getRando} from "../../toolbox/get-rando.js"
import {mockConfig} from "../../assembly/backend/config/mock-config.js"
import {mockAuthTables} from "../../features/auth/tables/mock-auth-tables.js"
import {memoryFlexStorage} from "../../toolbox/flex-storage/memory-flex-storage.js"
import {mockAppTables} from "../../features/auth/aspects/apps/tables/mock-app-tables.js"
import {prepareAuthPolicies} from "../../features/auth/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../framework/api/unconstrained-table.js"

export async function prepareMockAuth() {
	const rando = await getRando()
	const appId = rando.randomId()
	const appOrigin = "chasemoskal.com"
	const config = mockConfig({
		platformHome: `https://xiome.io/`,
		platformOrigins: ["xiome.io"],
	})
	const storage = memoryFlexStorage()
	const unconstrainedAuthTables = new UnconstrainedTables(
		await mockAuthTables(storage)
	)
	const authPolicies = prepareAuthPolicies({
		config,
		appTables: await mockAppTables(storage),
		authTables: unconstrainedAuthTables,
		verifyToken: mockVerifyToken(),
	})
	return {
		appId,
		rando,
		config,
		storage,
		appOrigin,
		authPolicies,
	}
}
