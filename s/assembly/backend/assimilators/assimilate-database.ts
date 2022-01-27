
import * as dbmage from "dbmage"

import {AssimilatorOptions} from "../types/assilimator-options.js"
import {mockDatabaseUnwrapped} from "../database/mock-database.js"
import {applyDatabaseWrapping} from "../database/apply-database-wrapping.js"
import {originsToDatabase} from "../../../features/auth/utils/origins-to-database.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {makeTableNameWithHyphens} from "../../../common/make-table-name-with-hyphens.js"
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
		dbmage.SchemaToShape<DatabaseSchemaUnisolated> = {
		apps: {
			registrations: true,
			owners: true,
		},
	}

	const databaseShapeRequiresAppIsolation:
		dbmage.SchemaToShape<DatabaseSchemaRequiresAppIsolation> = {
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

	const databaseShape: dbmage.SchemaToShape<DatabaseSchema> = {
		...databaseShapeRequiresAppIsolation,
		...databaseShapeUnisolated,
	}

	const mockStorage = config.database === "mock-storage"
		? configureMockStorage()
		: memoryFlexStorage()

	const databaseRaw = applyDatabaseWrapping(
		config.database === "mock-storage"
			? mockDatabaseUnwrapped(mockStorage)
			: await configureMongo({
				databaseShape,
				config: {...config, database: config.database},
			})
	)

	{ // bake app tables
		const {appId, home, label, origins} = config.platform.appDetails
		const table = databaseRaw.tables.apps.registrations
		const fallbackDatabase = dbmage.memory({
			shape: databaseShape,
			makeTableName: makeTableNameWithHyphens,
		})
		await fallbackDatabase.tables.apps.registrations.create({
			appId: dbmage.Id.fromString(appId),
			home,
			label,
			origins: originsToDatabase(origins),
			archived: false,
		})
		const moddedTable = dbmage.fallback({
			table,
			fallbackTable: fallbackDatabase.tables.apps.registrations,
		})
		databaseRaw.tables.apps.registrations = moddedTable
	}

	return {
		databaseRaw,
		mockStorage,
	}
}
