
import {Passkey} from "../../core-types.js"

const passkeyRegex = /^([0-9a-f]{64})\.([0-9a-f]{64})$/

export function parsePasskey(passkey: string): Passkey {
	const [, passkeyId, secret] = passkeyRegex.exec(passkey)
	return {passkeyId, secret}
}
