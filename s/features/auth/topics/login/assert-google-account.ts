
import {Rando} from "../../../../toolbox/get-rando.js"
import {and} from "../../../../toolbox/dbby/dbby-helpers.js"

import {generateAccountRow} from "./generate-account-row.js"
import {AccountRow, UserTables, GoogleResult} from "../../auth-types.js"

export async function assertGoogleAccount({rando, tables, googleResult}: {
			rando: Rando
			tables: UserTables
			googleResult: GoogleResult
		}): Promise<{userId: string}> {

	const {googleId, avatar} = googleResult
	const accountViaGoogle = await tables.accountViaGoogle.one({
		conditions: and({equal: {googleId}}),
	})

	let account: AccountRow
	if (accountViaGoogle) {
		account = await tables.account.one({
			conditions: and({equal: {userId: accountViaGoogle.userId}}),
		})
	}
	else {
		account = generateAccountRow({rando})
		await Promise.all([
			tables.account.create(account),
			tables.accountViaGoogle.create({
				googleId,
				googleAvatar: avatar,
				userId: account.userId,
			}),
		])
	}

	return account
}
