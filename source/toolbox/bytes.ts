
const u8 = (buffer: ArrayBuffer) => new Uint8Array(buffer)

export function encodeHex(bytes: ArrayBuffer) {
	let result = ""
	for (const byte of u8(bytes)) {
		result += ("0" + (byte & 0xFF).toString(16)).slice(-2)
	}
	return result
}

export function decodeHex(hex: string): ArrayBuffer {
	const result: number[] = []
	for (let i = 0; i < hex.length; i += 2)
		result.push(parseInt(hex.substr(i, 2), 16))
	return new Uint8Array(result).buffer
}

export function encodeBase64url(bytes: ArrayBuffer): string {
	return btoa(String.fromCharCode(...u8(bytes)))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
}

export function decodeBase64url(base64: string): ArrayBuffer {
	return new Uint8Array(
		Array.from(
			atob(
				addEqualsPadding(
					base64
						.replace(/-/g, "+")
						.replace(/_/g, "/")
				)
			)
		)
		.map(character => character.charCodeAt(0))
	).buffer
}

function addEqualsPadding(base64: string) {
	return base64 + Array((4 - base64.length % 4) % 4 + 1).join("=")
}
