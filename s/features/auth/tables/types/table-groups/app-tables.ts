
import {AppRow} from "../rows/app-row.js"
import {AppOwnershipRow} from "../rows/app-ownership-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type AppTables = {
	app: DbbyTable<AppRow>
	appOwnership: DbbyTable<AppOwnershipRow>
}
