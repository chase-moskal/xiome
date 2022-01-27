
// import {Rando} from "dbmage"
// import {AuthTables} from "../../../../types/auth-tables.js"
// import {generateAccountRow} from "./generate-account-row.js"

// export async function assertGoogleAccount({rando, authTables, googleResult}: {
// 			rando: Rando
// 			authTables: AuthTables
// 			googleResult: GoogleResult
// 		}): Promise<{userId: DamnId}> {

// 	const {googleId, avatar} = googleResult
// 	const accountViaGoogle = await authTables.users.accountViaGoogle.one({
// 		conditions: and({equal: {googleId}}),
// 	})

// 	let account: AccountRow
// 	if (accountViaGoogle) {
// 		account = await tables.account.one({
// 			conditions: and({equal: {userId: accountViaGoogle.userId}}),
// 		})
// 	}
// 	else {
// 		account = generateAccountRow({rando})
// 		await Promise.all([
// 			tables.account.create(account),
// 			tables.accountViaGoogle.create({
// 				googleId,
// 				googleAvatar: avatar,
// 				userId: account.userId,
// 			}),
// 		])
// 	}

// 	return {userId: account.userId}
// }
