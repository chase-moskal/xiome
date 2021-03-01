
import {AppRow} from "./app-row.js"
import {AppOwnershipRow} from "./app-ownership-row.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"

export type AppTables = {
	app: DbbyTable<AppRow>
	appOwnership: DbbyTable<AppOwnershipRow>
}
