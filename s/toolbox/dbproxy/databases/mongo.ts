
import {Collection, MongoClient, TransactionOptions} from "mongodb"

import {objectMap} from "../../object-map.js"
import {down, downs, up} from "./mongo/conversions.js"
import {orderToSort, prepareQuery} from "./mongo/queries.js"
import {pathToStorageKey} from "./utils/path-to-storage-key.js"
import {AmbiguousUpdate, MongoDatabase, Row, Schema, SchemaToShape, Shape, Table} from "../types.js"

export function mongo<xSchema extends Schema>({
		dbName, client, shape, transactionOptions,
	}: {
		dbName: string
		client: MongoClient
		shape: SchemaToShape<xSchema>
		transactionOptions?: TransactionOptions
	}): MongoDatabase<xSchema> {

	const db = client.db(dbName)

	function makeTable(collection: Collection): Table<Row> {
		return {
			async create(...rows) {
				await collection.insertMany(rows)
			},
			async read({conditions, order, offset, limit}) {
				const query = prepareQuery({conditions: conditions})
				let cursor = collection.find<Row>(query, undefined)
				if (offset) cursor = cursor.skip(offset)
				if (order) cursor = cursor.sort(orderToSort(order))
				if (limit) cursor = cursor.limit(limit)
				const rows = await cursor.toArray()
				return downs<Row>(rows)
			},
			async update({
				write,
				whole,
				upsert,
				...conditional
			}: AmbiguousUpdate<Row>) {
				const query = prepareQuery(conditional)
				if (write) {
					await collection.updateMany(query, {$set: up(write)}, {upsert: false})
				}
				else if (upsert) {
					await collection.updateOne(query, {$set: up(upsert)}, {upsert: true})
				}
				else if (whole) {
					await collection.deleteMany(query)
					await collection.insertOne(up(whole))
				}
				else throw new Error("invalid update")
			},
			async delete(conditional) {
				const query = prepareQuery(conditional)
				await collection.deleteMany(query)
			},
			async count(conditional) {
				const query = prepareQuery(conditional)
				return collection.countDocuments(query)
			},
			async readOne(conditional) {
				const query = prepareQuery(conditional)
				const row = await collection.findOne<Row>(query)
				return down<Row>(row)
			},
			async assert({make, ...conditional}) {
				const query = prepareQuery(conditional)
				let row = down<Row>(await collection.findOne<Row>(query))
				if (!row) {
					row = await make()
					await collection.insertOne(up<Row>(row))
				}
				return row
			},
		}
	}

	function makeTables() {
		function recurse(shape: Shape, path: string[]) {
			return objectMap(shape, (value, key) =>{
				const currentPath = [...path, key]
				const storageKey = pathToStorageKey(currentPath)
				const collection = db.collection(storageKey)
				return typeof value === "boolean"
					? makeTable(collection)
					: recurse(value, [...path, key])
			})
		}
		return recurse(shape, [])
	}

	const tables = makeTables()

	return {
		tables,
		async transaction(action, options = transactionOptions) {
			const session = client.startSession()
			let result: any
			try {
				result = await session.withTransaction(async() => action({
					tables,
					async abort() {
						await session.abortTransaction()
					},
				}), options)
			}
			catch (error) {
				console.error("transaction failed")
			}
			finally {
				await session.endSession()
			}
			return result
		},
	}
}
