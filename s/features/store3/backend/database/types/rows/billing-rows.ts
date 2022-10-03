
import * as dbmage from "dbmage"

export type CustomerRow = dbmage.AsRow<{
	userId: dbmage.Id
	stripeCustomerId: string
}>
