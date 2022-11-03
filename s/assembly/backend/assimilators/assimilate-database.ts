
import * as dbmage from "dbmage"

import {databaseShape} from "../database/database-shapes.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {mockDatabaseUnwrapped} from "../database/mock-database.js"
import {applyDatabaseWrapping} from "../database/apply-database-wrapping.js"
import {originsToDatabase} from "../../../features/auth/utils/origins-to-database.js"
import {appConstraintKey} from "../types/database.js"

export async function assimilateDatabase({
		config,
		configureMongo,
		configureMockStorage,
	}: {
		config: AssimilatorOptions["config"]
		configureMongo: AssimilatorOptions["configureMongo"]
		configureMockStorage: AssimilatorOptions["configureMockStorage"]
	}) {

	const mockStorage = config.database === "mock-storage"
		? configureMockStorage()
		: dbmage.memoryFlexStorage()

	let databaseRaw = applyDatabaseWrapping(
		config.database === "mock-storage"
			? mockDatabaseUnwrapped(mockStorage)
			: await configureMongo({
				databaseShape,
				config: {...config, database: config.database},
			})
	)

	{ // bake app tables
		const {appId, home, label, origins} = config.platform.appDetails
		const appRegistrationsTableWithFallback = dbmage.fallback({
			table: databaseRaw.tables.apps.registrations,
			fallbackRows: [
				{
					appId: dbmage.Id.fromString(appId),
					home,
					label,
					origins: originsToDatabase(origins),
					archived: false,
				}
			],
		})
		databaseRaw = dbmage.subsection(databaseRaw, tables => {
			return {
				...tables,
				apps: {
					...tables.apps,
					registrations: appRegistrationsTableWithFallback,
				},
			}
		})
	}

	return {
		databaseRaw,
		mockStorage,
	}
}
