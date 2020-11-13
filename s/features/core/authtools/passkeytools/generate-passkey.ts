
import {Passkey} from "../../core-types.js"
import {Rando} from "../../../../toolbox/get-rando.js"

export function generatePasskey(rando: Rando): Passkey {
	return {
		secret: rando.randomId(),
		passkeyId: rando.randomId(),
	}
}
