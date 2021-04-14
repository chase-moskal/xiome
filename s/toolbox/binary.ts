
//
// hex
//

export function encodeHex(buffer: ArrayBuffer) {
	let result = ""
	for (const byte of new Uint8Array(buffer))
		result += ("0" + (byte & 0xFF).toString(16)).slice(-2)
	return result
}

export function decodeHex(hex: string): ArrayBuffer {
	const result: number[] = []
	for (let i = 0; i < hex.length; i += 2)
		result.push(parseInt(hex.substr(i, 2), 16))
	return new Uint8Array(result).buffer
}

//
// base 64 url
//

function addEqualsPadding(base64: string) {
	return base64 + Array((4 - base64.length % 4) % 4 + 1).join("=")
}

export function encodeBase64url(buffer: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
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

//
// base 42
//

export const base42_characters = "256789BCDFGHJKMNPRSTWXYZbcdfghkmnpqrstwxyz"

function bufferToBig(buffer: ArrayBuffer): bigint {
	const hex = encodeHex(buffer)
	return BigInt("0x" + hex)
}

function bigToBuffer(big: bigint): ArrayBuffer {
	const hex = big.toString(16)
	return decodeHex(hex)
}

export function encodeBase42(buffer: ArrayBuffer) {
	const recurse = (value: bigint): string =>
		value < 42n
			? base42_characters[Number(value)]
			: recurse(value / 42n) + base42_characters[Number(value % 42n)]
	const big = bufferToBig(buffer)
	return recurse(big)
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

	return bigToBuffer(sum)
}
