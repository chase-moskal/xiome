
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {objectMap} from "../../../toolbox/object-map.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"
import {originsToDatabase} from "../../../features/auth/utils/origins-to-database.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {DatabaseSchema, DatabaseSchemaRequiresAppIsolation, DatabaseSchemaUnisolated} from "../types/database.js"

export async function assimilateDatabase({
		config,
		configureMongo,
		configureMockStorage,
	}: {
		config: AssimilatorOptions["config"]
		configureMongo: AssimilatorOptions["configureMongo"]
		configureMockStorage: AssimilatorOptions["configureMockStorage"]
	}) {

	const databaseShapeUnisolated:
		dbproxy.SchemaToShape<DatabaseSchemaUnisolated> = {
		apps: {
			registrations: true,
			owners: true,
		},
	}

	const databaseShapeRequiresAppIsolation:
		dbproxy.SchemaToShape<DatabaseSchemaRequiresAppIsolation> = {
		auth: {
			users: {
				accounts: true,
				emails: true,
				latestLogins: true,
				profiles: true,
			},
			permissions: {
				privilege: true,
				role: true,
				roleHasPrivilege: true,
				userHasRole: true,
			},
		},
		example: {
			examplePosts: true,
		},
		questions: {
			likes: true,
			reports: true,
			answerPosts: true,
			questionPosts: true,
		},
		store: {
			// TODO store
			// billing: {
			// 	customers: true,
			// 	storeInfo: true,
			// 	subscriptionPlans: true,
			// 	subscriptions: true,
			// },
			merchant: {
				stripeAccounts: true,
			},
			subscription: {
				plans: true,
				tiers: true,
			},
		},
		videos: {
			dacastAccountLinks: true,
			viewDacast: true,
			viewPrivileges: true,
		},
		notes: {
			notes: true,
			questionDetails: true,
		},
	}

	const databaseShape: dbproxy.SchemaToShape<DatabaseSchema> = {
		...databaseShapeRequiresAppIsolation,
		...databaseShapeUnisolated,
	}

	function mockWithStorage(mockStorage: FlexStorage) {
		return dbproxy.flex<DatabaseSchema>(mockStorage, databaseShape)
	}

	const mockStorage = config.database === "mock-storage"
		? configureMockStorage()
		: memoryFlexStorage()

	const databaseRaw = dbproxy.subsection(
		config.database === "mock-storage"
			? mockWithStorage(mockStorage)
			: await configureMongo({
				databaseShape,
				config: {...config, database: config.database},
			}),
		tables => {
			const wrappedTables = UnconstrainedTable.wrapTables(tables)
			const nakedTables = (<dbproxy.SchemaToTables<DatabaseSchemaUnisolated>>objectMap(databaseShapeUnisolated, (v, key) => databaseRaw.tables[key]))
			return {
				...wrappedTables,
				...nakedTables,
			}
		},
	)

	{ // bake app tables
		const {appId, home, label, origins} = config.platform.appDetails
		databaseRaw.tables.apps.registrations = dbproxy.fallback({
			table: databaseRaw.tables.apps.registrations,
			fallbackTable: await (async() => {
				const fallbackDatabase = dbproxy.memory(databaseShape)
				await fallbackDatabase.tables.apps.registrations.create({
					appId: dbproxy.Id.fromString(appId),
					home,
					label,
					origins: originsToDatabase(origins),
					archived: false,
				})
				return fallbackDatabase.tables.apps.registrations
			})()
		})
	}

	return {
		databaseRaw,
		mockStorage,
	}
}
