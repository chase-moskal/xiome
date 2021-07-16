
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"

export type AppTables = {
	apps: DbbyTable<{
		appId: DamnId
		label: string
		home: string
		origins: string
		archived: boolean
	}>
	owners: DbbyTable<{
		appId: DamnId
		userId: DamnId
	}>
}
