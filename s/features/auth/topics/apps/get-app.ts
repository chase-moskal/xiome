
import {ApiError} from "renraku/x/api/api-error.js"
import {AppRow, AuthTables} from "../../../../types.js"
import {find} from "../../../../toolbox/dbby/dbby-mongo.js"

export async function getApp(tables: AuthTables, appId: string): Promise<AppRow> {
	const appRow = await tables.app.one(find({appId}))
	if (!appRow) throw new ApiError(404, "appId not found")
	return appRow
}
