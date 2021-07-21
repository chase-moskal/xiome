
import {encodeHex, decodeHex, isHex} from "../binary/hex.js"

export class DamnId {

	static fromBinary(binary: ArrayBuffer) {
		return new DamnId(binary)
	}

	static fromString(text: string) {
		const binary = decodeHex(text)
		return new DamnId(binary)
	}

	static isId(text: string) {
		return text.length === 64 && isHex(text)
	}

	#binary: ArrayBuffer
	#string: string

	constructor(binary: ArrayBuffer) {
		this.#binary = binary
		this.#string = encodeHex(binary)
	}

	get binary() { return this.#binary }
	get string() { return this.#string }
	toBinary() { return this.#binary }
	toString() { return this.#string }
}
