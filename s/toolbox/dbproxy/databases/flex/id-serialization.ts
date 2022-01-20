
import {Id} from "../../id.js"
import {Row, serializationKey, SerializedRow} from "../../types.js"

export function serialize(row: Row) {
	const serializedRow: SerializedRow = {}
	for (const [key, value] of Object.entries(row)) {
		if (value instanceof Id)
			serializedRow[key] = {
				[serializationKey]: "Id",
				value: value.toString(),
			}
		else
			serializedRow[key] = value
	}
	return serializedRow
}

export function deserialize(serializedRow: SerializedRow) {
	const row: Row = {}
	for (const [key, value] of Object.entries(serializedRow)) {
		if (value && typeof value === "object" && value[serializationKey]) {
			if (value[serializationKey] === "Id")
				row[key] = Id.fromString(value.value)
			else
				throw new Error(`unknown serialized type "${value[serializationKey]}"`)
		}
		else
			row[key] = value
	}
	return row
}
