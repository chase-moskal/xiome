
import {Suite, expect, assert} from "cynic"

import id from "./id.test.js"

import {and, find, or} from "./helpers.js"
import {fallback} from "./fallback.js"
import * as dbproxy from "./dbproxy.js"
import {Row, SchemaToShape, Table} from "./types.js"
import {constraint} from "./constraint.js"
import {getRando} from "../get-rando.js"
import {Id} from "./id.js"

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
	"flex database": {
		"create rows and read 'em back unconditionally": async() => {
			const tables = await setupThreeUserDemo()
			const rows = await tables.users.read({conditions: false})
			return expect(rows.length).equals(3)
		},
		"empty and/or conditions explode": async() => {
			const {users} = await setupThreeUserDemo()
			await expect(async() => users.read({conditions: and()})).throws()
			await expect(async() => users.read({conditions: or()})).throws()
		},
		"read one": async() => {
			const {users} = await setupThreeUserDemo()
			expect(
				await users.readOne({conditions: and({equal: {userId: "u123"}})})
			).ok()
		},
		"ignore undefined conditions": async() => {
			const {users} = await setupThreeUserDemo()
			const result = await users.readOne({conditions: and({equal: {userId: "u123"}}, undefined)})
			expect(result.userId).equals("u123")
		},
		"read one with not set condition": async() => {
			const {users} = await setupThreeUserDemo()
			await users.create({userId: "u999", balance: 1, location: undefined})
			return expect(
				(await users.readOne({
					conditions: and({notSet: {location: true}})
				})).userId
			).equals("u999")
		},
		"assert one": async() => {
			const {users} = await setupThreeUserDemo()
			const fallback: DemoUser = {
				userId: "u000",
				balance: 1000,
				location: "russia",
			}
			return (true
				&& expect(
						(await users.assert({
							conditions: and({equal: {userId: "u123"}}),
							make: async() => fallback,
						})).location
					).equals("america")
				&& expect(
						(await users.assert({
							conditions: and({equal: {userId: "u000"}}),
							make: async() => fallback,
						})).location
					).equals("russia")
			)
		},
		"read sorting via order": async() => {
			const {users} = await setupThreeUserDemo()
			const result1 = await users.read({conditions: false, order: {balance: "ascend"}})
			const result2 = await users.read({conditions: false, order: {balance: "descend"}})
			return expect(result1[0].balance).equals(-100)
				&& expect(result2[0].balance).equals(100)
		},
		"read pagination, limit and offset": async() => {
			const {users} = await setupThreeUserDemo()
			const result1 = await users.read({conditions: false, limit: 2})
			const result2 = await users.read({conditions: false, limit: 2, offset: 1})
			return expect(result1.length).equals(2)
				&& expect(result2[0].userId).equals("u124")
		},
		"read with single conditions": async() => {
			const {users} = await setupThreeUserDemo()
			return (true
				&& expect([
						...await users.read({conditions: and({equal: {userId: "u123"}})}),
						...await users.read({conditions: and({equal: {userId: "u124"}})}),
						...await users.read({conditions: and({equal: {userId: "u125"}})}),
					].length).equals(3)
				&& expect((
						await users.read({conditions: and({
							greater: {balance: 50},
							equal: {location: "america"},
						})})
					).length).equals(1)
				&& expect((
						await users.read({conditions: and({
							notEqual: {location: "america"}
						})})
					).length).equals(2)
				&& expect((
						await users.read({conditions: and({less: {balance: 50}})})
					).length).equals(2)
				&& expect((
						await users.read({conditions: and({search: {location: "can"}})})
					).length).equals(2)
				&& expect((
						await users.read({conditions: and({search: {location: /can/}})})
					).length).equals(2)
			)
		},
		"read with multiple conditions": async() => {
			const {users} = await setupThreeUserDemo()
			return (true
				&& expect(
					(await users.read({
						conditions: and(
							{less: {balance: 200}},
							{equal: {location: "canada"}},
						)
					})).length
				).equals(2)
				&& expect(
					(await users.read({
						conditions: or(
							{less: {balance: 50}},
							{equal: {location: "america"}},
						)
					})).length
				).equals(3)
				&& expect(
					(await users.read({
						conditions: or(
							and(
								{less: {balance: 50}},
								{equal: {location: "canada"}},
							),
							{equal: {location: "greenland"}},
						)
					})).length
				).equals(2)
			)
		},
		"delete a row and it's gone": async() => {
			const {users} = await setupThreeUserDemo()
			await users.delete({conditions: and({equal: {userId: "u123"}})})
			const rows = await users.read({conditions: false})
			return expect(rows.length).equals(2)
		},
		"update write to a row": async() => {
			const {users} = await setupThreeUserDemo()
			await users.update({
				conditions: and({equal: {userId: "u123"}}),
				write: {location: "argentina"},
			})
			const user = await users.readOne({conditions: and({equal: {userId: "u123"}})})
			return (true
				&& expect(user.location).equals("argentina")
				&& expect(user.balance).equals(100)
			)
		},
		"update whole row": async() => {
			const {users} = await setupThreeUserDemo()
			const userId = "u123"
			await users.update({
				conditions: and({equal: {userId}}),
				whole: {userId, balance: 50, location: "argentina"},
			})
			const user = await users.readOne({conditions: and({equal: {userId}})})
			return (true
				&& expect(user.location).equals("argentina")
				&& expect(user.balance).equals(50)
			)
		},
		"update upsert can update or insert": async() => {
			const {users} = await setupThreeUserDemo()
			await Promise.all([
				users.update({
					conditions: and({equal: {userId: "u123"}}),
					upsert: {
						userId: "u123",
						balance: 500,
						location: "america",
					},
				}),
				users.update({
					conditions: and({equal: {userId: "u126"}}),
					upsert: {
						userId: "u126",
						balance: 1000,
						location: "argentina",
					},
				}),
			])
			const america = await users.readOne({conditions: and({equal: {userId: "u123"}})})
			const argentina = await users.readOne({conditions: and({equal: {userId: "u126"}})})
			return (true
				&& expect(america.balance).equals(500)
				&& expect(argentina.balance).equals(1000)
			)
		},
		"count rows with conditions": async() => {
			const {users} = await setupThreeUserDemo()
			const countAll = await users.count({conditions: false})
			const countCanadians = await users.count({conditions: and({equal: {location: "canada"}})})
			return (true
				&& expect(countAll).equals(3)
				&& expect(countCanadians).equals(2)
			)
		},
		"save and load ids": async() => {
			const rando = await getRando()
			const {tables: {table}} = dbproxy.memoryDatabase<{table: {id: Id, a: number}}>({table: true})
			const a1 = {id: rando.randomId2(), a: 1}
			const a2 = {id: rando.randomId2(), a: 2}
			await table.create(a1)
			await table.create(a2)
			const b1 = await table.readOne(find({id: a1.id}))
			// const all = await table.read({conditions: false})
			expect(b1.a).equals(1)
			assert(b1.id instanceof Id, "recovered id is instance")
		},
	},
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
	"constraint": async() => {
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
