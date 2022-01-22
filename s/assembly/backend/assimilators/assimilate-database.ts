
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {waitForProperties} from "../tools/zippy.js"
import {objectMap} from "../../../toolbox/object-map.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {processBlueprint} from "../tools/process-blueprint.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {DatabaseSchema, DatabaseSchemaWithAppIsolation, DatabaseSchemaWithoutAppIsolation} from "../types/database.js"
import {originsToDatabase} from "../../../features/auth/utils/origins-to-database.js"
import {AppRegistrationRow} from "../../../features/auth/aspects/apps/types/app-tables.js"

export async function assimilateDatabase({
		config,
		configureMongo,
		configureMockStorage,
	}: {
		config: AssimilatorOptions["config"]
		configureMongo: AssimilatorOptions["configureMongo"]
		configureMockStorage: AssimilatorOptions["configureMockStorage"]
	}): Promise<{
		database: DatabaseSchema
		mockStorage: FlexStorage
	}> {

	const databaseShapeWithoutAppIsolation:
		dbproxy.SchemaToShape<DatabaseSchemaWithoutAppIsolation> = {
		apps: {
			registrations: true,
			owners: true,
		},
	}

	const databaseShapeWithAppIsolation:
		dbproxy.SchemaToShape<DatabaseSchemaWithAppIsolation> = {
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

	async function mockWithStorage(mockStorage: FlexStorage) {
		const {tables, transaction} = dbproxy.memory({
			...databaseShapeWithAppIsolation,
			...databaseShapeWithoutAppIsolation,
		})
		const 
		return {
			mockStorage,
			database: tables,
		}

		// const databaseRaw = <DatabaseSchemaWithoutAppIsolation>await waitForProperties(
		// 	processBlueprint({
		// 		blueprint: blueprintForRawDatabase,
		// 		process: path => dbbyX(mockStorage, path.join("-")),
		// 	})
		// )
		// const databaseUnconstrained = await (async() => {
		// 	const databaseNamespaced = <DatabaseSchemaWithAppIsolation>await waitForProperties(
		// 		processBlueprint({
		// 			blueprint: blueprintForNamespacedDatabase,
		// 			process: path => dbbyX(mockStorage, path.join("-")),
		// 		})
		// 	)
		// 	return <Unconstrain<DatabaseSchemaWithAppIsolation>>objectMap(
		// 		databaseNamespaced,
		// 		value => new UnconstrainedTables(value),
		// 	)
		// })()
		// return {
		// 	mockStorage,
		// 	database: {
		// 		...databaseRaw,
		// 		...databaseUnconstrained,
		// 	}
		// }
	}

	const results = config.database === "mock-storage"
		? await mockWithStorage(configureMockStorage())
		: await configureMongo({
			blueprintForRawDatabase,
			blueprintForNamespacedDatabase,
			config: {...config, database: config.database},
		})

	const bakedAppTables = await (async() => {
		const platformApp = config.platform.appDetails
		const {apps: appTables} = results.database
		return <typeof appTables>{
			...appTables,
			registrations: dbbyHardback({
				frontTable: appTables.registrations,
				backTable: await dbbyMemory<AppRegistrationRow>([
					{
						appId: DamnId.fromString(platformApp.appId),
						home: platformApp.home,
						label: platformApp.label,
						origins: originsToDatabase(platformApp.origins),
						archived: false,
					}
				])
			}),
		}
	})()

	return {
		database: {
			...results.database,
			apps: bakedAppTables,
		},
		mockStorage: results.mockStorage,
	}
}
