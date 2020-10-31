
import {addMetaTopic} from "renraku/dist/curries.js"

import {makeCoreApi} from "./core-api.js"
import {dbbyMemory} from "../../toolbox/dbby/dbby-memory.js"
import {prepareConstrainTables} from "../../toolbox/dbby/dbby-constrain.js"
import {AccountRow, AccountViaGoogleRow, AccountViaPasskeyRow} from "./core-types.js"

export function testableCoreApi() {

	const rawtables = {
		account: dbbyMemory<AccountRow>(),
		accountViaGoogle: dbbyMemory<AccountViaGoogleRow>(),
		accountViaPasskey: dbbyMemory<AccountViaPasskeyRow>(),
	}

	const api = makeCoreApi({
		signToken: async(a) => "abc",
		verifyToken: async() => (<any>{}),
		constrainTables: prepareConstrainTables(rawtables),
	})

	return {api, rawtables}
}
