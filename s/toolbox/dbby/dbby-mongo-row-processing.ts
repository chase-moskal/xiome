
import {Binary} from "mongodb"
import {DbbyRow} from "./dbby-types.js"
import {objectMap} from "../object-map.js"
import {DamnId} from "../damnedb/damn-id.js"

const toArrayBuffer = (buffer: Buffer): ArrayBuffer =>
	new Uint8Array(buffer).buffer

// strip away the mongo database id's -- we don't use 'em
function skimMongoId<Row extends DbbyRow>(row: Row): Row {
	if (row) {
		const {_id: noop, ...skimmed} = <any>row
		return skimmed
	}
	return undefined
}

export function valueUp(value: any, key: string): any {
	return value instanceof DamnId
		? new Binary(Buffer.from(value.binary))
		: value
}

export function valueDown(value: any, key: string): any {
	return value instanceof Binary
		? new DamnId(toArrayBuffer(value.buffer))
		: value
}

// process a row before it's sent to mongo
// - transform any damnid to mongo binary type
export function up<Row extends DbbyRow>(row: Partial<Row>): any {
	return objectMap(row, valueUp)
}

// process a row retrieved from mongo
// - transform any binary types into damnid
export function down<Row extends DbbyRow>(data: any): Row {
	return (data && typeof data === "object")
		? objectMap(skimMongoId(data), valueDown)
		: data
}

export function ups<Row extends DbbyRow>(rows: Partial<Row>[]): any[] {
	return rows.map(up)
}

export function downs<Row extends DbbyRow>(rows: any[]): Row[] {
	return rows.map(<any>down)
}
