
import {base42characters, decodeBase42, encodeBase42} from "./binary/base42.js"

export function identifierToBinary(id: string) {
	return decodeBase42(id)
}

export function identifierFromBinary(binary: ArrayBuffer) {
	let id = encodeBase42(binary)
	while (id.length < 48)
		id = base42characters[0] + id
	return id
}
