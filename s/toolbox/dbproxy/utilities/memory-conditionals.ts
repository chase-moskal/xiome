
import {Id} from "../id.js"
import {Condition, Conditional, Conditions, ConditionTree, Row} from "../types.js"

export function compare<xRow>(
		row: xRow,
		conditional: Partial<xRow>,
		evaluator: (a: any, b: any) => boolean,
	) {
	let failures = 0
	for (const [key, value] of Object.entries(conditional)) {
		if (!evaluator(row[key], value))
			failures += 1
	}
	return !failures
}

export function rowVersusCondition<xRow extends Row>(
		row: xRow,
		condition: Condition<xRow>
	): boolean {

	if (!Object.keys(condition).length)
		return true
	let failures = 0
	type Evaluator = (a: any, b: any) => boolean

	const check = (
			conditions: Partial<{[P in keyof xRow]: any}>,
			evaluator: Evaluator
		) => {
		if (conditions && !compare(row, conditions, evaluator))
			failures += 1
	}

	const checks: {[key: string]: Evaluator} = {
		set: a => a !== undefined && a !== null,
		equal: (a, b) =>
			a instanceof Id
				? a.string === b.string
				: a === b,
		greater: (a, b) => a > b,
		greatery: (a, b) => a >= b,
		less: (a, b) => a < b,
		lessy: (a, b) => a <= b,
		listed: (a, b) => a.includes(b),
		search: (a, b) => typeof b === "string" ? a.includes(b) : b.test(a),
	}

	function not(evaluator: Evaluator): Evaluator {
		return (a, b) => !evaluator(a, b)
	}

	check(condition.set, checks.set)
	check(condition.equal, checks.equal)
	check(condition.greater, checks.greater)
	check(condition.greatery, checks.greatery)
	check(condition.less, checks.less)
	check(condition.lessy, checks.lessy)
	check(condition.listed, checks.listed)
	check(condition.search, checks.search)
	
	check(condition.notSet, not(checks.set))
	check(condition.notEqual, not(checks.equal))
	check(condition.notGreater, not(checks.greater))
	check(condition.notGreatery, not(checks.greatery))
	check(condition.notLess, not(checks.less))
	check(condition.notLessy, not(checks.lessy))
	check(condition.notListed, not(checks.listed))
	check(condition.notSearch, not(checks.search))

	return !failures
}

export function rowVersusConditional<Row extends {}>(
		row: Row,
		conditional: Conditional<Row>,
	): boolean {

	function crawl(conditions: Conditions<Row>) {
		if (conditions === false) return true
		const [operation, ...rawconds] = conditions
		const conds = rawconds.filter(c => !!c)
		if (conds.length === 0)
			throw new Error("empty and/or conditions are not allowed")
		const and = operation === "and"
		let valid = and
		const applyResult = (result: boolean) =>
			valid = and
				? valid && result
				: valid || result
		for (const condition of conds) {
			if (condition === false || Array.isArray(condition)) {
				applyResult(crawl(<ConditionTree<Row>>condition))
			}
			else {
				const result = rowVersusCondition(row, condition)
				applyResult(result)
			}
		}
		return valid
	}

	return crawl(conditional.conditions)
}
