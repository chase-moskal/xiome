
import {AppTables} from "../../../../auth/tables/types/table-groups/app-tables.js"
import {PlatformUserAuth} from "../../../../auth/policies/types/platform-user-auth.js"
import {PlatformUserMeta} from "../../../../auth/policies/types/platform-user-meta.js"

export interface AppsMeta extends PlatformUserMeta {}

export interface AppsAuth extends PlatformUserAuth {
	appTables: AppTables
}
