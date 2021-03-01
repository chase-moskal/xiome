import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {AppOwnershipRow} from "./AppOwnershipRow.js"
import {AppRow} from "./AppRow.js"


export type AppTables = {
	app: DbbyTable<AppRow>
	appOwnership: DbbyTable<AppOwnershipRow>
}
