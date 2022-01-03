
import {on} from "events"
import mongodb from "mongodb"
import {dbbyMongo} from "../../../../../toolbox/dbby/dbby-mongo.js"
import {ChatMuteRow, ChatPostRow, ChatRoomStatusRow} from "../../../common/types/chat-concepts.js"

export async function mongoChatPersistence (){

	const client = await new mongodb.MongoClient("mongodb://localhost:27017/test").connect()
	const db = client.db('test')
	const collections = {
		muteCollection: db.collection('chatCollection'),
		postCollection: db.collection('chatCollection'),
		statusCollection: db.collection('chatCollection'),
	}

	const chatTables = {
		posts: dbbyMongo<ChatPostRow>({collection: collections.postCollection}),
		mutes: dbbyMongo<ChatMuteRow>({collection: collections.muteCollection}),
		roomStatuses: dbbyMongo<ChatRoomStatusRow>({collection: collections.statusCollection})
	}

	const postsChangeStream = collections.postCollection.watch()
	postsChangeStream.on('change', (change) => {
		
	})

	const mutesChangeStream = collections.muteCollection.watch()
	mutesChangeStream.on('change', (change) => {

	})

	const statusChangeStream = collections.statusCollection.watch()
	statusChangeStream.on('change', (change) => {

	})
}
