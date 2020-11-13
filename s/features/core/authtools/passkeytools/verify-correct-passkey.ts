
import {digestPassword} from "./digest-password.js"
import {AccountViaPasskeyRow} from "../../core-types.js"
import {secureCompareStrings} from "./secure-compare-strings.js"

export async function verifyCorrectPasskey({secret, passkeyRow}: {
			secret: string
			passkeyRow: AccountViaPasskeyRow
		}) {

	const digest = await digestPassword({
		password: secret,
		salt: passkeyRow.salt,
	})

	const isCorrect = secureCompareStrings(digest, passkeyRow.digest)
	return isCorrect
}
