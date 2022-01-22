
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {objectMap} from "../../../toolbox/object-map.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"
import {originsToDatabase} from "../../../features/auth/utils/origins-to-database.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {DatabaseSchema, DatabaseSchemaRequiresAppIsolation, DatabaseSchemaUnisolated, DatabaseFinal, DatabaseTables, DatabaseSubsection} from "../types/database.js"

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
		return dbproxy.memory<DatabaseSchema>(databaseShape)
	}

	function processDatabase(database: dbproxy.Database<DatabaseSchema>) {
		const tables = {
			...UnconstrainedTable.wrapTables(database.tables),
			...<dbproxy.SchemaToTables<DatabaseSchemaUnisolated>>objectMap(databaseShapeUnisolated, (v, key) => database.tables[key]),
		}
		function subsection<xGrabbed>(grabber: (t: typeof tables) => xGrabbed): DatabaseSubsection<xGrabbed> {
			return {
				tables: grabber(tables),
				transaction: <DatabaseSubsection<xGrabbed>["transaction"]>(async<xResult>(action: ({}: {
						tables: xGrabbed
						abort: () => Promise<void>
					}) => Promise<xResult>) =>
					database.transaction(async(options) => action({
						tables: grabber(tables),
						abort: options.abort
					}))
				),
			}
		}
		const root = subsection(t => t)
		return {
			tables: root.tables,
			transaction: root.transaction,
			subsection,
		}
	}

	const mockStorage = config.database === "mock-storage"
		? configureMockStorage()
		: memoryFlexStorage()

	const database = processDatabase(
		config.database === "mock-storage"
			? mockWithStorage(mockStorage)
			: await configureMongo({
				databaseShape,
				config: {...config, database: config.database},
			})
	)

	{ // bake app tables
		const {appId, home, label, origins} = config.platform.appDetails
		database.tables.apps.registrations = dbproxy.fallback({
			table: database.tables.apps.registrations,
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
		database,
		mockStorage,
	}
}
