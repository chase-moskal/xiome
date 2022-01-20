
import {Binary} from "mongodb"

import {Id} from "../../id.js"
import {Row} from "../../types.js"
import {objectMap} from "../../../object-map.js"

const toArrayBuffer = (buffer: Buffer): ArrayBuffer =>
	new Uint8Array(buffer).buffer

// strip away the mongo database id's -- we don't use 'em
function skimMongoId<xRow extends Row>(row: xRow): xRow {
	if (row) {
		const {_id: noop, ...skimmed} = <any>row
		return skimmed
	}
	return undefined
}

export function valueUp(value: any, key: string): any {
	return value instanceof Id
		? new Binary(Buffer.from(value.binary))
		: value
}

export function valueDown(value: any, key: string): any {
	return value instanceof Binary
		? new Id(toArrayBuffer(value.buffer))
		: value
}

// process a row before it's sent to mongo
// - transform any id to mongo binary type
export function up<xRow extends Row>(row: Partial<xRow>): any {
	return objectMap(row, valueUp)
}

// process a row retrieved from mongo
// - transform any binary types into id
export function down<xRow extends Row>(data: any): xRow {
	return (data && typeof data === "object")
		? objectMap(skimMongoId(data), valueDown)
		: data
}

export function ups<xRow extends Row>(rows: Partial<xRow>[]): any[] {
	return rows.map(up)
}

export function downs<xRow extends Row>(rows: any[]): xRow[] {
	return rows.map(<any>down)
}
