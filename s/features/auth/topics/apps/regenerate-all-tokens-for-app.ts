
import { SignToken } from "redcrypto/dist/types.js"

import {AuthTables} from "../../auth-types.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {makeAppTokenRow} from "./make-app-token-row.js"
import {find} from "../../../../toolbox/dbby/dbby-mongo.js"
import {concurrent} from "../../../../toolbox/concurrent.js"

export async function regenerateAllTokensForApp({appId, tables, rando, signToken}: {
		rando: Rando
		appId: string
		tables: AuthTables
		signToken: SignToken
	}) {

	const {appRow, appTokenRows} = await concurrent({
		appRow: tables.app.one(find({appId})),
		appTokenRows: tables.appToken.read(find({appId})),
	})

	const replacementRows = await Promise.all(
		appTokenRows.map(appTokenRow => makeAppTokenRow({
			appRow,
			draft: {
				appId,
				label: appTokenRow.label,
				origins: appTokenRow.origins.split(";"),
			},
			rando,
			signToken,
		}))
	)

	await Promise.all(replacementRows.map(async row => {
		await tables.appToken.update({
			...find({appTokenId: row.appTokenId}),
			whole: row,
		})
	}))
}
