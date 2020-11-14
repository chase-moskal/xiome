
import {PasskeyPayload} from "../core-types.js"

export function writePasskey({passkeyId, secret}: PasskeyPayload): string {
	return `${passkeyId}.${secret}`
}
