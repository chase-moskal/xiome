
import {Suite, expect} from "cynic"

import id from "./id.test.js"
import * as dbproxy from "./dbproxy.js"
import {memoryFlexStorage} from "../flex-storage/memory-flex-storage.js"

type DemoUser = {
	userId: string
	balance: number
	location: string
}

async function setupThreeUserDemo() {
	type Database = {users: {userId: string, balance: number, location: string}}
	const {tables} = dbproxy.flexDatabase<Database>(
		memoryFlexStorage(),
		{users: true}
	)
	await Promise.all([
		tables.users.create({userId: "u123", balance: 100, location: "america"}),
		tables.users.create({userId: "u124", balance: 0, location: "canada"}),
		tables.users.create({userId: "u125", balance: -100, location: "canada"}),
	])
	return tables
}

export default <Suite>{
	id,
	"flex database": {
		"create rows and read 'em back unconditionally": async() => {
			const tables = await setupThreeUserDemo()
			const rows = await tables.users.read({conditions: false})
			return expect(rows.length).equals(3)
		},
	},
}
