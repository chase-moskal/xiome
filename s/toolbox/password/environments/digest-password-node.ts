
import {decodeHex} from "dbmage"
import {digestIterations, digestByteLength, digestAlgorithm} from "../password-constants.js"

export async function digestPasswordNode({salt, password}: {
			salt: string
			password: string
		}): Promise<string> {

	const crypto = await import("crypto")
	const {promisify} = await import("util")

	const pbkdf2 = promisify(crypto.pbkdf2)
	const decode = (subject: string) => Buffer.from(decodeHex(subject))

	const buffer = await pbkdf2(
		decode(password),
		decode(salt),
		digestIterations,
		digestByteLength,
		digestAlgorithm,
	)

	const digest = buffer.toString("hex")
	return digest
}
