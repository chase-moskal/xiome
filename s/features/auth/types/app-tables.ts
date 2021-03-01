import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {AppOwnershipRow} from "./app-ownership-row.js"
import {AppRow} from "./app-row.js"


export type AppTables = {
	app: DbbyTable<AppRow>
	appOwnership: DbbyTable<AppOwnershipRow>
}
