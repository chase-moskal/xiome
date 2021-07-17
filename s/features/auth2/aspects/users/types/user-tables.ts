
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {AsDbbyRow, DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {NakedNamespacedTables} from "../../../../../framework/api/types/table-namespacing-for-apps.js"

export type UserTables = {
	accounts: DbbyTable<AccountRow>
	profiles: DbbyTable<ProfileRow>
	emails: DbbyTable<EmailRow>
	latestLogins: DbbyTable<LatestLoginRow>
}

export type AccountRow = AsDbbyRow<{
	userId: DamnId
	created: number
}>

export type ProfileRow = AsDbbyRow<{
	userId: DamnId
	nickname: string
	tagline: string
	avatar: undefined | string
}>

export type EmailRow = AsDbbyRow<{
	userId: DamnId
	email: string
}>

export type LatestLoginRow = AsDbbyRow<{
	userId: DamnId
	time: number
}>
