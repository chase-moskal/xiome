
import * as dbmage from "dbmage"

export type CustomerRow = dbmage.AsRow<{
	connectId: dbmage.Id

	userId: dbmage.Id
	stripeCustomerId: string
}>
