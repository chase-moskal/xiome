
import {Db} from "mongodb"
import {DbbyRow} from "./dbby/dbby-types.js"
import {dbbyMongo} from "./dbby/dbby-mongo.js"

export function prepareTableFunction(database: Db) {
	return function table<Row extends DbbyRow>(label: string) {
		return dbbyMongo<Row>({collection: database.collection(label)})
	}
}
