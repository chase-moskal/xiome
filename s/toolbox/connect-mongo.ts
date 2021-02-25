
// import {MongoConfig} from "../features/auth/auth-types.js"
// import {DbbyRow} from "./dbby/dbby-types.js"
// import {dbbyMongo} from "./dbby/dbby-mongo.js"
// import {MongoClient} from "../commonjs/mongodb.js"

// export async function connectMongo(mongo: MongoConfig) {
// 	const client = new MongoClient(mongo.link, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true
// 	})

// 	await client.connect()
// 	const database = client.db(mongo.database)

// 	return {
// 		database,
// 		dbbyTable<Row extends {}>(collectionName: string) {
// 			return dbbyMongo<Row>({
// 				collection: database.collection(collectionName)
// 			})
// 		},
// 	}
// }
