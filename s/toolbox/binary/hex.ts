
export function encodeHex(binary: ArrayBuffer) {
	let result = ""
	for (const byte of new Uint8Array(binary))
		result += ("0" + (byte & 0xFF).toString(16)).slice(-2)
	return result
}

export function decodeHex(hex: string): ArrayBuffer {
	const result: number[] = []
	for (let i = 0; i < hex.length; i += 2)
		result.push(parseInt(hex.substr(i, 2), 16))
	return new Uint8Array(result).buffer
}
