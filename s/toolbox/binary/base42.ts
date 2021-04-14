
import {decodeHex, encodeHex} from "./hex.js"

export const base42characters = "256789BCDFGHJKMNPRSTWXYZbcdfghkmnpqrstwxyz"

function bigToBinary(big: bigint): ArrayBuffer {
	const hex = big.toString(16)
	return decodeHex(hex)
}

function bigFromBinary(binary: ArrayBuffer): bigint {
	const hex = encodeHex(binary)
	return BigInt("0x" + hex)
}

export function encodeBase42(binary: ArrayBuffer) {
	const recurse = (value: bigint): string =>
		value < 42n
			? base42characters[Number(value)]
			: recurse(value / 42n) + base42characters[Number(value % 42n)]
	const big = bigFromBinary(binary)
	return recurse(big)
}

export function decodeBase42(base42: string) {
	let sum = 0n
	let step = 1n

	for (let i = base42.length - 1; i >= 0; i--) {
		const index = BigInt(base42characters.indexOf(base42[i]))
		if (index == -1n)
			throw new Error("invalid base42 character")
		sum += step * index
		step *= 42n
	}

	return bigToBinary(sum)
}
