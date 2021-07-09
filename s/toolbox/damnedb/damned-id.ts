
import {encodeBase42, decodeBase42} from "../binary/base42.js"

export class DamnedId {
	static fromString(text: string) {
		const binary = decodeBase42(text)
		return new DamnedId(binary)
	}

	#binary: ArrayBuffer
	#string: string
	get toBinary() { return this.#binary }
	get toString() { return this.#string }

	constructor(binary: ArrayBuffer) {
		this.#binary = binary
		this.#string = encodeBase42(binary)
	}
}
