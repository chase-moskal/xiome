
import {encodeBase42, decodeBase42} from "../binary/base42.js"

export class DamnId {
	static fromString(text: string) {
		const binary = decodeBase42(text)
		return new DamnId(binary)
	}

	#binary: ArrayBuffer
	#string: string
	get binary() { return this.#binary }
	get string() { return this.#string }
	toBinary() { return this.#binary }
	toString() { return this.#string }

	constructor(binary: ArrayBuffer) {
		this.#binary = binary
		this.#string = encodeBase42(binary)
	}
}
