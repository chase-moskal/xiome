
import {AccountRow, AccountViaGoogleRow, AccountViaPasskeyRow} from "./core-types.js"

import {makeCoreApi} from "./core-api.js"
import {dbbyMemory} from "../../toolbox/dbby/dbby-memory.js"
import {prepareConstrainTables} from "../../toolbox/dbby/dbby-constrain.js"

export function mockCoreApi() {

	const rawtables = {
		account: dbbyMemory<AccountRow>(),
		accountViaGoogle: dbbyMemory<AccountViaGoogleRow>(),
		accountViaPasskey: dbbyMemory<AccountViaPasskeyRow>(),
	}

	return makeCoreApi({
		signToken: async(a) => "abc",
		verifyToken: async() => (<any>{}),
		constrainTables: prepareConstrainTables(rawtables),
	})
}
