
import {ApiError} from "renraku/x/api/api-error.js"
import {find} from "../../../../toolbox/dbby/dbby-mongo.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AppRow} from "../../tables/types/rows/app-row.js"

export async function getApp(tables: AuthTables, appId: string): Promise<AppRow> {
	const appRow = await tables.app.app.one(find({appId}))
	if (!appRow) throw new ApiError(404, "appId not found")
	return appRow
}
