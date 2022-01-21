
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"

export type UserTables = dbproxy.AsSchema<{
	accounts: AccountRow
	profiles: ProfileRow
	emails: EmailRow
	latestLogins: LatestLoginRow
}>

export type AccountRow = dbproxy.AsRow<{
	userId: dbproxy.Id
	created: number
}>

export type ProfileRow = dbproxy.AsRow<{
	userId: dbproxy.Id
	nickname: string
	tagline: string
	avatar: undefined | string
}>

export type EmailRow = dbproxy.AsRow<{
	userId: dbproxy.Id
	email: string
}>

export type LatestLoginRow = dbproxy.AsRow<{
	userId: dbproxy.Id
	time: number
}>
