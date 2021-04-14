
const u8 = (binary: ArrayBuffer) => new Uint8Array(binary)
const base42_characters = "256789BCDFGHJKMNPRSTWXYZbcdfghkmnpqrstwxyz"

export function encodeHex(binary: ArrayBuffer) {
	let result = ""
	for (const byte of u8(binary))
		result += ("0" + (byte & 0xFF).toString(16)).slice(-2)
	return result
}

export function decodeHex(hex: string): ArrayBuffer {
	const result: number[] = []
	for (let i = 0; i < hex.length; i += 2)
		result.push(parseInt(hex.substr(i, 2), 16))
	return new Uint8Array(result).buffer
}

export function encodeBase64url(binary: ArrayBuffer): string {
	return btoa(String.fromCharCode(...u8(binary)))
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

export function encodeBase42(binary: ArrayBuffer) {
	const hex = encodeHex(binary)
	let big = BigInt("0x" + hex)
	let base42 = ""

	while (big > 0n) {
		const remainder = big % 42n
		big /= 42n
		base42 += base42_characters[Number(remainder)]
	}

	return base42
}

export function decodeBase42(base42: string) {
	let sum = 0n
	let step = 1n

	for (let i = base42.length - 1; i >= 0; i--) {
		const index = BigInt(base42_characters.indexOf(base42[i]))
		if (index == -1n)
			throw new Error("invalid base42 character")
		sum += step * index
		step *= 42n
	}

	const hex = sum.toString(16)
	const binary = decodeHex(hex)

	return binary
}
