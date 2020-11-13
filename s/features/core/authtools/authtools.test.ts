
import {Suite, assert} from "cynic"

import {Passkey} from "../core-types.js"
import {getRando} from "../../../toolbox/get-rando.js"

import {writePasskey} from "./write-passkey.js"
import {parsePasskey} from "./passkeytools/parse-passkey.js"

export default <Suite>(async() => {
	const rando = await getRando()
	return {
		"passkey parsing": async() => {
			const p1: Passkey = {passkeyId: rando.randomId(), secret: rando.randomId()}
			const encoded = writePasskey(p1)
			const p2 = parsePasskey(encoded)
			assert(p1.passkeyId === p2.passkeyId, "passkeyId is preserved")
			assert(p1.secret === p2.secret, "secret is preserved")
		},
	}
})
