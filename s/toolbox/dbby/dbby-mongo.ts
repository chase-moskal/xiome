
import {Collection, FilterQuery} from "mongodb"

import {objectMap} from "../object-map.js"
import {escapeRegex} from "../escape-regex.js"
export {and, or, find} from "./dbby-helpers.js"

import {DbbyTable, DbbyRow, DbbyCondition, DbbyConditional, DbbyConditionTree, DbbyUpdateAmbiguated, DbbyOrder} from "./dbby-types.js"

function skimMongoId<Row extends DbbyRow>(row: Row): Row {
	if (row) {
		const {_id: noop, ...skimmed} = <any>row
		return skimmed
	}
	return undefined
}

export function dbbyMongo<Row extends DbbyRow>({collection}: {
		collection: Collection
	}): DbbyTable<Row> {
	return {

		async create(...rows) {
			await collection.insertMany(rows)
		},

		async read({order, offset = 0, limit = 10000, ...conditional}) {
			const query = prepareQuery(conditional)
			let cursor = collection.find<Row>(query, undefined)
			if (offset) cursor = cursor.skip(offset)
			if (order) cursor = cursor.sort(orderToSort(order))
			if (limit) cursor = cursor.limit(limit)
			const rows = await cursor.toArray()
			return rows.map(skimMongoId)
		},

		async one(conditional) {
			const query = prepareQuery(conditional)
			const row = await collection.findOne<Row>(query)
			return skimMongoId(row)
		},

		async assert({make, ...conditional}) {
			const query = prepareQuery(conditional)
			let row = await collection.findOne<Row>(query)
			if (!row) {
				row = await make()
				await collection.insertOne(row)
			}
			return skimMongoId(row)
		},

		async update({
				write,
				whole,
				upsert,
				...conditional
			}: DbbyUpdateAmbiguated<Row>) {
			const query = prepareQuery(conditional)
			if (write) {
				await collection.updateMany(query, {$set: write}, {upsert: false})
			}
			else if (upsert) {
				await collection.updateOne(query, {$set: upsert}, {upsert: true})
			}
			else if (whole) {
				await collection.deleteMany(query)
				await collection.insertOne(whole)
			}
			else throw new Error("invalid update")
		},

		async delete(conditional) {
			const query = prepareQuery(conditional)
			await collection.deleteMany(query)
		},

		async count(conditional) {
			const query = prepareQuery(conditional)
			return collection.count(query)
		},
	}
}

function prepareQuery<Row extends DbbyRow>({
		conditions
	}: DbbyConditional<Row>): FilterQuery<{}> {

	if (!conditions) return {}

	function recurse(tree: DbbyConditionTree<Row>): FilterQuery<{}> {
		const [operator, ...conds] = tree

		const query = conds
			.map(cond => Array.isArray(cond)
				? recurse(cond)
				: conditionsToMongoQuery(cond))
			.filter(cond => !!cond)

		return operator === "and"
			? {$and: query}
			: {$or: query}
	}

	return recurse(conditions)
}

function orderToSort<Row extends DbbyRow>(
		order: DbbyOrder<Row>
	): {[key: string]: -1 | 0 | 1} {
	return objectMap(order, value =>
		!!value
			? value === "ascend"
				? 1
				: -1
			: 0
	)
}

function isSet(a: any): boolean {
	return a !== undefined && a !== null
}

function mapwise(x: any, y: (value: any) => any) {
	return x && objectMap(x, y)
}

function notwise(x: any, y: (value: any) => any) {
	const cond = mapwise(x, y)
	return cond && {$nor: [cond]}
}

const mongoloids: {[key: string]: (value: any) => any} = {
	set: value => ({$exists: value}),
	equal: value => ({$eq: value}),
	greater: value => ({$gt: value}),
	greatery: value => ({$gte: value}),
	less: value => ({$lt: value}),
	lessy: value => ({$lte: value}),
	listed: value => ({$in: [value]}),
	search: value => ({
		$regex: typeof value === "string"
			? escapeRegex(value)
			: value
	}),
}

function conditionsToMongoQuery<Row extends DbbyRow>(
			conditions: false | DbbyCondition<Row>
		): FilterQuery<Row> {
	return conditions
		? <any>{
			$and: [
				mapwise(conditions.set, mongoloids.set),
				mapwise(conditions.equal, mongoloids.equal),
				mapwise(conditions.greater, mongoloids.greater),
				mapwise(conditions.greatery, mongoloids.greatery),
				mapwise(conditions.less, mongoloids.less),
				mapwise(conditions.lessy, mongoloids.lessy),
				mapwise(conditions.listed, mongoloids.listed),
				mapwise(conditions.search, mongoloids.search),

				notwise(conditions.notSet, mongoloids.set),
				notwise(conditions.notEqual, mongoloids.equal),
				notwise(conditions.notGreater, mongoloids.greater),
				notwise(conditions.notGreatery, mongoloids.greatery),
				notwise(conditions.notLess, mongoloids.less),
				notwise(conditions.notLessy, mongoloids.lessy),
				notwise(conditions.notListed, mongoloids.listed),
				notwise(conditions.notSearch, mongoloids.search),
			].filter(isSet)
		}
		: {}
}
