
import {Suite, expect} from "cynic"

import id from "./id.test.js"

import {find} from "./helpers.js"
import {fallback} from "./fallback.js"
import * as dbproxy from "./dbproxy.js"
import {SchemaToShape} from "./types.js"

type DemoUser = {
	userId: string
	balance: number
	location: string
}

type DemoSchema = {
	users: DemoUser
}

const demoShape: SchemaToShape<DemoSchema> = {
	users: true
}

async function setupThreeUserDemo() {
	const {tables} = dbproxy.memoryDatabase<DemoSchema>(demoShape)
	await Promise.all([
		tables.users.create({userId: "u123", balance: 100, location: "america"}),
		tables.users.create({userId: "u124", balance: 0, location: "canada"}),
		tables.users.create({userId: "u125", balance: -100, location: "canada"}),
	])
	return tables
}

export default <Suite>{
	id,
	"fallback": {
		"read": async() => {
			const {users} = await setupThreeUserDemo()
			const {tables: {users: usersFallback}}
				= dbproxy.memoryDatabase<DemoSchema>(demoShape)
			await usersFallback.create({userId: "u92", balance: 92, location: "victoria"})
			const combinedTable = fallback({table: users, fallbackTable: usersFallback})
			const result01 = await combinedTable.read({conditions: false})
			const result02 = await combinedTable.read(find({userId: "u92"}))
			expect(result01.length).equals(4)
			expect(result02.length).equals(1)
		},
	},
	"flex database": {
		"create rows and read 'em back unconditionally": async() => {
			const tables = await setupThreeUserDemo()
			const rows = await tables.users.read({conditions: false})
			return expect(rows.length).equals(3)
		},
	},
}
