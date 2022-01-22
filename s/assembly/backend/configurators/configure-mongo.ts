
import mongodb from "mongodb"

import {SecretConfig} from "../types/secret-config.js"
import {objectMap} from "../../../toolbox/object-map.js"
import {dbbyMongo} from "../../../toolbox/dbby/dbby-mongo.js"
import {processBlueprint} from "../tools/process-blueprint.js"
import {BlueprintForTables} from "../types/blueprint-for-tables.js"
import {DatabaseSchemaWithAppIsolation, DatabaseSchemaWithoutAppIsolation} from "../types/database.js"
import {ConfigDatabaseMongo} from "../types/config-database-mongo.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {Unconstrain, UnconstrainedTables} from "../../../framework/api/unconstrained-table.js"

export async function configureMongo({
		blueprintForRawDatabase, blueprintForNamespacedDatabase, config,
	}: {
		blueprintForRawDatabase: BlueprintForTables<DatabaseSchemaWithoutAppIsolation>
		blueprintForNamespacedDatabase: BlueprintForTables<DatabaseSchemaWithAppIsolation>
		config: {database: ConfigDatabaseMongo} & SecretConfig
	}) {

	const mongo = await new mongodb.MongoClient(config.database.mongo.link).connect()
	const db = mongo.db(config.database.mongo.db)

	const databaseRaw = <DatabaseSchemaWithoutAppIsolation>processBlueprint({
		blueprint: blueprintForRawDatabase,
		process: path => dbbyMongo({
			collection: db.collection(path.join("-")),
		}),
	})

	const databaseUnconstrained = await (async() => {
		const databaseNamespaced = <DatabaseSchemaWithAppIsolation>processBlueprint({
			blueprint: blueprintForNamespacedDatabase,
			process: path => dbbyMongo({
				collection: db.collection(path.join("-")),
			}),
		})
		return <Unconstrain<DatabaseSchemaWithAppIsolation>>objectMap(
			databaseNamespaced,
			value => new UnconstrainedTables(value),
		)
	})()

	return {
		mockStorage: memoryFlexStorage(),
		database: {...databaseRaw, ...databaseUnconstrained},
	}
}
