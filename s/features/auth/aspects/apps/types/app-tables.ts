
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {AsDbbyRow, DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type AppTables = {
	registrations: DbbyTable<AppRegistrationRow>
	owners: DbbyTable<OwnerRow>
}

export type AppRegistrationRow = AsDbbyRow<{
	appId: DamnId
	label: string
	home: string
	origins: string
	archived: boolean
}>

export type OwnerRow = AsDbbyRow<{
	appId: DamnId
	userId: DamnId
}>
