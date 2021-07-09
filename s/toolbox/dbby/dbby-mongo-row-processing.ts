
import {Binary} from "mongodb"
import {DbbyRow} from "./dbby-types.js"
import {objectMap} from "../object-map.js"
import {DamnId} from "../damnedb/damn-id.js"

// strip away the mongo database id's -- we don't use 'em
export function skimMongoId<Row extends DbbyRow>(row: Row): Row {
	if (row) {
		const {_id: noop, ...skimmed} = <any>row
		return skimmed
	}
	return undefined
}

export function valueUp(value: any, key: string): any {
	return key.startsWith("id_")
		? new Binary(Buffer.from(DamnId.fromString(value).binary))
		: value instanceof DamnId
			? new Binary(Buffer.from(value.binary))
			: value
}

export function valueDown(value: any, key: string): any {
	return key.startsWith("id_")
		? new DamnId(value.buffer.buffer).string
		: value instanceof Binary
			? new DamnId(value.buffer.buffer)
			: value
}

// process a row before it's sent to mongo
// - transform any id_* to mongo binary type
// - transform any damnid to mongo binary type
export function up<Row extends DbbyRow>(row: Partial<Row>): any {
	return objectMap(row, valueUp)
}

// process a row retrieved from mongo
// - transform any id_* from mongo binary to strings via damnid
// - transform any binary types into damnid
export function down<Row extends DbbyRow>(data: any): Row {
	return objectMap(skimMongoId(data), valueDown)
}

export function ups<Row extends DbbyRow>(rows: Partial<Row>[]): any[] {
	return rows.map(up)
}

export function downs<Row extends DbbyRow>(rows: any[]): Row[] {
	return rows.map(<any>down)
}
