
import {and} from "../../../toolbox/dbby/dbby-helpers.js"

import {CoreTables} from "../core-types.js"
import {parsePasskey} from "./passkeytools/parse-passkey.js"
import {invalidPasskeyError} from "./passkeytools/invalid-passkey-error.js"
import {verifyCorrectPasskey} from "./passkeytools/verify-correct-passkey.js"

export async function verifyPasskeyAccount({tables, passkey}: {
			passkey: string
			tables: CoreTables
		}): Promise<{userId: string}> {

	// TODO implement hard-coded passkey account for technician!

	const {passkeyId, secret} = parsePasskey(passkey)
	const passkeyRow = await tables.accountViaPasskey.one({
		conditions: and({equal: {passkeyId}})
	})

	if (!passkeyRow) await invalidPasskeyError()
	const isCorrect = await verifyCorrectPasskey({passkeyRow, secret})
	if (!isCorrect) await invalidPasskeyError()

	return {userId: passkeyRow.userId}
}
