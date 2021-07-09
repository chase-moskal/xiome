
import {Binary} from "mongodb"
import {DbbyRow} from "./dbby-types.js"
import {objectMap} from "../object-map.js"
import {DamnId} from "../damnedb/damn-id.js"

export function dbbyMongoRowProcessing<Row extends DbbyRow>() {

	// strip away the mongo database id's -- we don't use 'em
	function skimMongoId(row: Row): Row {
		if (row) {
			const {_id: noop, ...skimmed} = <any>row
			return skimmed
		}
		return undefined
	}

	// process a row before it's sent to mongo
	// - transform any DamnId's to mongo binary type
	function up(row: Partial<Row>): any {
		return objectMap(
			row,
			value =>
				value instanceof DamnId
					? new Binary(Buffer.from(value.binary), )
					: value
		)
	}

	// process a row retrieved from mongo
	// - transform any binary types into DamnId's
	function down(data: any): Row {
		return objectMap(
			skimMongoId(data),
			value =>
				value instanceof Binary
					? new DamnId(value.buffer.buffer)
					: value
		)
	}

	function ups(rows: Partial<Row>[]): any[] {
		return rows.map(up)
	}

	function downs(rows: any[]): Row[] {
		return rows.map(down)
	}

	return {up, ups, down, downs}
}
