
import {decodeHex, encodeHex} from "dbmage"
import {pbkdf2Algorithm, digestBitLength} from "../password-constants.js"

export async function digestPasswordBrowser({salt, password}: {
			salt: string
			password: string
		}): Promise<string> {
	
	const key = await window.crypto.subtle.importKey(
		"raw",
		decodeHex(password),
		{name: pbkdf2Algorithm.name},
		false,
		["deriveKey", "deriveBits"],
	)

	const digest = await window.crypto.subtle.deriveBits(
		{...pbkdf2Algorithm, salt: decodeHex(salt)},
		key,
		digestBitLength,
	)

	return encodeHex(digest)
}
