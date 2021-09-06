
import {waitForProperties} from "../tools/zippy.js"
import {dbbyX} from "../../../toolbox/dbby/dbby-x.js"
import {objectMap} from "../../../toolbox/object-map.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {processBlueprint} from "../tools/process-blueprint.js"
import {dbbyMemory} from "../../../toolbox/dbby/dbby-memory.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {BlueprintForTables} from "../types/blueprint-for-tables.js"
import {dbbyHardback} from "../../../toolbox/dbby/dbby-hardback.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {DatabaseFinal, DatabaseNamespaced, DatabaseRaw} from "../types/database.js"
import {originsToDatabase} from "../../../features/auth/utils/origins-to-database.js"
import {AppRegistrationRow} from "../../../features/auth/aspects/apps/types/app-tables.js"
import {Unconstrain, UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export async function assimilateDatabase({
		config,
		configureMongo,
		configureMockStorage,
	}: AssimilatorOptions): Promise<{
		database: DatabaseFinal
		mockStorage: FlexStorage
	}> {

	const blueprintForRawDatabase: BlueprintForTables<DatabaseRaw> = {
		apps: {
			registrations: true,
			owners: true,
		},
	}

	const blueprintForNamespacedDatabase: BlueprintForTables<DatabaseNamespaced> = {
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
		livestream: {
			shows: true,
		},
		store: {
			billing: {
				customers: true,
				storeInfo: true,
				subscriptionPlans: true,
				subscriptions: true,
			},
			merchant: {
				stripeAccounts: true,
			},
		},
	}

	async function mockWithStorage(mockStorage: FlexStorage) {
		const databaseRaw = <DatabaseRaw>await waitForProperties(
			processBlueprint({
				blueprint: blueprintForRawDatabase,
				process: path => dbbyX(mockStorage, path.join("-")),
			})
		)
		const databaseUnconstrained = await (async() => {
			const databaseNamespaced = <DatabaseNamespaced>await waitForProperties(
				processBlueprint({
					blueprint: blueprintForNamespacedDatabase,
					process: path => dbbyX(mockStorage, path.join("-")),
				})
			)
			return <Unconstrain<DatabaseNamespaced>>objectMap(
				databaseNamespaced,
				value => new UnconstrainedTables(value),
			)
		})()
		return {
			mockStorage,
			database: {
				...databaseRaw,
				...databaseUnconstrained,
			}
		}
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
