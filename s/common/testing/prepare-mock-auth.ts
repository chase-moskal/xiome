
import * as dbmage from "dbmage"
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

import {mockConfig} from "../../assembly/backend/config/mock-config.js"
import {mockDatabase} from "../../assembly/backend/database/mock-database.js"
import {DatabaseSafe} from "../../assembly/backend/types/database.js"
import {addApp} from "../../features/auth/aspects/apps/services/helpers/app-actions.js"
import {prepareAuthPolicies} from "../../features/auth/policies/prepare-auth-policies.js"
import {UnconstrainedTable} from "../../framework/api/unconstrained-table.js"

export async function prepareMockAuth() {
	const rando = await dbmage.getRando()
	const appOrigin = "chasemoskal.com"
	const config = mockConfig({
		root: "",
		platformHome: `https://xiome.io/`,
		platformOrigins: ["xiome.io"],
	})

	const storage = dbmage.memoryFlexStorage()
	const databaseRaw = mockDatabase(storage)

	const {appId: appIdString} = await addApp({
		rando,
		appDraft: {
			home: `https://${appOrigin}/`,
			label: "Mock App",
			origins: [appOrigin],
		},
		ownerUserId: rando.randomId().string,
		appsDatabase: dbmage.subsection(databaseRaw, tables => tables.apps),
	})

	const appId = dbmage.Id.fromString(appIdString)

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
		authPolicies,
		databaseRaw,
		database: <DatabaseSafe>UnconstrainedTable.constrainDatabaseForApp({
			appId,
			database: databaseRaw,
		}),
	}
}
