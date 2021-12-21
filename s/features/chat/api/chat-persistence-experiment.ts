
// 1. can you connect to your local mongodb instance?
// 2. can you write data into it?
// 3. can you read data from it?
// 4. can you subscribe to watch for changes to a collection?


import mongodb from "mongodb"

void async function main() {
	const first =  new mongodb.MongoClient("mongodb://localhost:27017/test").connect()
	const db = (await first).db('test')
	// console.log(db.collection('chatCollection'))
	console.log(db.listCollections().toArray((err, cols) => {
		if (err) {
			console.log(err)
		}
		console.log(cols)
	}))

	// ;(await first).close()
	// ;(await collection).insertOne({
	// 	"name" : "starthrills",
	// 	"age": 21
	// })



} ()

