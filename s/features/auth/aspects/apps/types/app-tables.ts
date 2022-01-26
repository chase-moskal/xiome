
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"

export type AppSchema = dbproxy.AsSchema<{
	registrations: AppRegistrationRow
	owners: OwnerRow
}>

export type AppRegistrationRow = dbproxy.AsRow<{
	appId: dbproxy.Id
	label: string
	home: string
	origins: string
	archived: boolean
}>

export type OwnerRow = dbproxy.AsRow<{
	appId: dbproxy.Id
	userId: dbproxy.Id
}>
