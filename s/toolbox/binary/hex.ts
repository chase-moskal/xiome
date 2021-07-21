
export function encodeHex(binary: ArrayBuffer) {
	let result = ""
	for (const byte of new Uint8Array(binary))
		result += ("0" + (byte & 0xFF).toString(16)).slice(-2)
	return result
}

const hexabet = "0123456789abcdef"

function isStrictHex(text: string) {
	for (const character of text)
		if (!hexabet.includes(character))
			return false
	return true
}

export function isHex(text: string) {
	return isStrictHex(text.toLowerCase())
}

export function decodeHex(text: string): ArrayBuffer {
	const hex = text.toLowerCase()

	if (!isStrictHex(hex))
		throw new Error("decodeHex: invalid hex")

	const result: number[] = []

	for (let i = 0; i < hex.length; i += 2)
		result.push(parseInt(hex.substr(i, 2), 16))

	return new Uint8Array(result).buffer
}
