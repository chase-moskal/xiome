
import {Rando} from "../../../toolbox/get-rando.js"
import {digestPassword} from "../../../toolbox/password/digest-password.js"

import {AccountViaPasskeyRow} from "../core-types.js"
import {generateAccount} from "../authtools/generate-account.js"

import {generatePasskey} from "./passkeytools/generate-passkey.js"

export async function generatePasskeyAccountData(rando: Rando) {
	const {secret, passkeyId} = generatePasskey(rando)
	const salt = rando.randomId()
	const account = generateAccount(rando)
	const digest = await digestPassword({salt, password: secret})
	const accountViaPasskey: AccountViaPasskeyRow = {
		salt,
		digest,
		passkeyId,
		userId: account.userId,
	}
	return {account, accountViaPasskey, passkeyId, secret}
}
