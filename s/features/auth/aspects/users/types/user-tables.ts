
import * as dbmage from "dbmage"

export type UserSchema = dbmage.AsSchema<{
	accounts: AccountRow
	profiles: ProfileRow
	emails: EmailRow
	latestLogins: LatestLoginRow
}>

export type AccountRow = dbmage.AsRow<{
	userId: dbmage.Id
	created: number
}>

export type ProfileRow = dbmage.AsRow<{
	userId: dbmage.Id
	nickname: string
	tagline: string
	avatar: undefined | string
}>

export type EmailRow = dbmage.AsRow<{
	userId: dbmage.Id
	email: string
}>

export type LatestLoginRow = dbmage.AsRow<{
	userId: dbmage.Id
	time: number
}>
