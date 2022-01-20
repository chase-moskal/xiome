
import {Filter, Sort} from "mongodb"

import {valueUp} from "./conversions.js"
import {objectMap} from "../../../object-map.js"
import {escapeRegex} from "../../../escape-regex.js"
import {Condition, Conditional, ConditionTree, Order, Row} from "../../types.js"

export function prepareQuery<xRow extends Row>({
		conditions
	}: Conditional<xRow>): Filter<any> {

	if (!conditions) return {}

	function recurse(tree: ConditionTree<xRow>): Filter<any> {
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

export function orderToSort<xRow extends Row>(
		order: Order<xRow>
	): Sort {
	return objectMap(order, value =>
		!!value
			? value === "ascend"
				? 1
				: -1
			: 1
	)
}

function isSet(a: any): boolean {
	return a !== undefined && a !== null
}

function mapwise(x: any, y: (value: any) => any) {
	const y2 = (value: any, key: string) => y(valueUp(value, key))
	return x && objectMap(x, y2)
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

function conditionsToMongoQuery<xRow extends Row>(
			conditions: false | Condition<xRow>
		): Filter<xRow> {
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
