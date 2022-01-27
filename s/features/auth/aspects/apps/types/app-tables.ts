
import * as dbmage from "dbmage"

export type AppSchema = dbmage.AsSchema<{
	registrations: AppRegistrationRow
	owners: OwnerRow
}>

export type AppRegistrationRow = dbmage.AsRow<{
	appId: dbmage.Id
	label: string
	home: string
	origins: string
	archived: boolean
}>

export type OwnerRow = dbmage.AsRow<{
	appId: dbmage.Id
	userId: dbmage.Id
}>
