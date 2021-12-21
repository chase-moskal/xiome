
import mongodb from "mongodb"
import {mainModule} from "process"

// async function listDatabases(client){
// 	let databasesList = await client.db().admin().listDatabases()

// 	console.log("Databases:")
// 	databasesList.databases.forEach(db => console.log(` - ${db.name}`))
// }

void async function main() {
	const db = new mongodb.MongoClient("mongodb://localhost:27017/test")
	console.log(db)
	// const collection = db.collection("chat-collection")

	// try {
	// 	await db.connect()
	// 	await listDatabases(db)
	// }
	// catch (e) {
	// 	console.error(e)
	// }
	// finally {
	// 	await db.close()
	// }
} ()
