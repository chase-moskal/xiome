
import {digestPassword} from "./digest-password.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {AccountViaPasskeyRow} from "../../core-types.js"

export async function verifyCorrectPasskey({secret, passkeyRow, rando}: {
			rando: Rando
			secret: string
			passkeyRow: AccountViaPasskeyRow
		}) {

	const digest = await digestPassword({
		password: secret,
		salt: passkeyRow.salt,
	})

	const isCorrect = rando.compare(digest, passkeyRow.digest)
	return isCorrect
}
