
import mongodb from "mongodb"

import * as dbmage from "dbmage"
import {mongo} from "dbmage/x/drivers/mongo.js"
import {DatabaseSchema} from "../types/database.js"
import {SecretConfig} from "../types/secret-config.js"
import {ConfigDatabaseMongo} from "../types/config-database-mongo.js"
import {makeTableNameWithHyphens} from "../../../common/make-table-name-with-hyphens.js"

export async function configureMongo({
		config, databaseShape,
	}: {
		config: {database: ConfigDatabaseMongo} & SecretConfig
		databaseShape: dbmage.SchemaToShape<DatabaseSchema>
	}) {

	const client = await new mongodb.MongoClient(config.database.mongo.link).connect()
	return mongo<DatabaseSchema>({
		client,
		shape: databaseShape,
		dbName: config.database.mongo.db,
		makeTableName: makeTableNameWithHyphens,
	})
}
