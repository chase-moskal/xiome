
import {Suite, expect} from "cynic"

import id from "./id.test.js"

import {find} from "./helpers.js"
import {fallback} from "./fallback.js"
import * as dbproxy from "./dbproxy.js"
import {Row, SchemaToShape, Table} from "./types.js"
import {constraint} from "./constraint.js"

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
	"constraint2": async() => {
		function constrainAppTable<xTable extends Table<Row>>(
				table: xTable,
				appId: string,
			) {
			return constraint<{appId: string}, xTable>({
				table,
				namespace: {appId},
			})
		}
		return {
			"read all rows from constrained table": async() => {
				const {tables: {users}} = dbproxy.memoryDatabase<DemoSchema>(demoShape)
				const alpha = constrainAppTable(users, "a1")
				await alpha.create(
					{userId: "u1", balance: 101, location: "canada"},
					{userId: "u2", balance: 102, location: "america"},
				)
				const results = await alpha.read({conditions: false})
				expect(results.length).equals(2)
			},
			"apply app id constraint": async() => {
				const {tables: {users}} = dbproxy.memoryDatabase<DemoSchema>(demoShape)
				const a1 = constrainAppTable(users, "a1")
				const a2 = constrainAppTable(users, "a2")
				await a1.create({userId: "u1", balance: 100, location: "america"})
				await a2.create({userId: "u2", balance: 100, location: "canada"})
				await a2.delete(find({userId: "u1"}))
				let failed = false
				try {
					await a1.update({...find({location: "canada"}), write: {balance: 99}})
				}
				catch (error) {
					failed = true
				}
				const userRows = await users.read({conditions: false})
				const canadian = await users.readOne(find({location: "canada"}))
				return expect(userRows.length).equals(2)
					&& expect(canadian.balance).equals(100)
					&& expect(failed).ok()
			},
		}
	},
}
