
import {Action, Update, Row, Shape, Table, Tables, Conditional} from "../types.js"
import {FlexStorage} from "../../flex-storage/types/flex-storage.js"
import {objectMap} from "../../object-map.js"
import {pathToStorageKey} from "./path-to-storage-key.js"

export async function memoryTransaction({shape, storage, action}: {
		shape: Shape
		storage: FlexStorage
		action: Action<Tables, any>
	}) {

	const operations: Operation.Any[] = []

	const tables = (() => {
		function recurse(shape: Shape, path: string[]): Tables {
			return objectMap(shape, (value, key) => {
				const currentPath = [...path, key]
				const storageKey = pathToStorageKey(currentPath)
				let cache: Row[] = undefined
				async function loadCacheOnce() {
					if (!cache)
						cache = await storage.read(storageKey)
				}
				return typeof shape === "boolean"?
					<Table<Row>>{
						async create(...rows) {
							await loadCacheOnce()
							operations.push({
								type: Operation.OpType.Create,
								path: [...path, key],
								rows,
							})
							cache.push(...rows)
						},
						async read(o) {
							await loadCacheOnce()
							// TODO implement conditionals
							return [...cache]
						},
						async update(o) {
							await loadCacheOnce()
							// TODO apply changes to cache
							operations.push({
								type: Operation.OpType.Update,
								path: currentPath,
								update: o,
							})
						},
						async delete(o) {
							await loadCacheOnce()
							// TODO apply changes to cache
							operations.push({
								type: Operation.OpType.Delete,
								path: currentPath,
								conditional: o,
							})
						},
						async count() {
							await loadCacheOnce()
							return cache.length
						},
						async readOne(o) {
							await loadCacheOnce()
							// TODO implement conditional
							return cache[0]
						},
						async assert(o) {
							const row = cache[0]
							// TODO implement conditional
							operations.push({
								type: Operation.OpType.Delete,
								path: currentPath,
								conditional: o,
							})
							return row
						},
					}:
					recurse(shape, [])
			})
		}
		return recurse(shape, [])
	})()

	let aborted = false
	const result = action({
		tables,
		abort() {
			aborted = true
		},
	})
	if (!aborted) {
		// TODO apply all operations to storage
	}
	return result
}

export namespace Operation {
	export enum OpType {
		Create,
		Update,
		Delete,
	}
	export interface OpBase {
		type: OpType
		path: string[]
	}
	export interface OpCreate extends OpBase {
		type: OpType.Create
		rows: Row[]
	}
	export interface OpUpdate extends OpBase {
		type: OpType.Update
		update: Update<Row>
	}
	export interface OpDelete extends OpBase {
		type: OpType.Delete
		conditional: Conditional<Row>
	}
	export type Any =
		| OpCreate
		| OpUpdate
		| OpDelete
}
