
import mongodb from "mongodb"

import {DatabaseSchema} from "../types/database.js"
import {SecretConfig} from "../types/secret-config.js"
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"
import {mongo} from "../../../toolbox/dbproxy/databases/mongo.js"
import {ConfigDatabaseMongo} from "../types/config-database-mongo.js"

export async function configureMongo({
		config, databaseShape,
	}: {
		config: {database: ConfigDatabaseMongo} & SecretConfig
		databaseShape: dbproxy.SchemaToShape<DatabaseSchema>
	}) {

	const client = await new mongodb.MongoClient(config.database.mongo.link).connect()
	return mongo<DatabaseSchema>({
		client,
		shape: databaseShape,
		dbName: config.database.mongo.db,
	})
}
