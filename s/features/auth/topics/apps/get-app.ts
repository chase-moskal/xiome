
import {ApiError} from "renraku/x/api/api-error.js"
import {AppRow} from "../../tables/types/rows/app-row.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"

export async function getApp(tables: AuthTables, id_app: string): Promise<AppRow> {
	const appRow = await tables.app.app.one(find({id_app}))
	if (!appRow) throw new ApiError(404, "id_app not found")
	return appRow
}
