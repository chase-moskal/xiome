
import {Passkey} from "../core-types.js"

export function writePasskey({passkeyId, secret}: Passkey): string {
	return `${passkeyId}.${secret}`
}
