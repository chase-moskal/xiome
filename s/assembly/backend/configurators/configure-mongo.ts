
import mongodb from "mongodb"

import {Database} from "../types/database.js"
import {SecretConfig} from "../types/secret-config.js"
import {dbbyMongo} from "../../../toolbox/dbby/dbby-mongo.js"
import {processBlueprint} from "../tools/process-blueprint.js"
import {BlueprintForTables} from "../types/blueprint-for-tables.js"
import {ConfigDatabaseMongo} from "../types/config-database-mongo.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"

export async function configureMongo({blueprint, config}: {
		blueprint: BlueprintForTables<Database>
		config: {database: ConfigDatabaseMongo} & SecretConfig
	}) {

	const mongo = await new mongodb.MongoClient(config.database.mongo.link, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).connect()
	const db = mongo.db(config.database.mongo.db)

	return {
		mockStorage: memoryFlexStorage(),
		database: <Database>processBlueprint({
			blueprint,
			process: path => dbbyMongo({
				collection: db.collection(path.join("-")),
			}),
		}),
	}
}
