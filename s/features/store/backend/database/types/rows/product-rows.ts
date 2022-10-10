
import * as dbmage from "dbmage"

export type ItemRow = dbmage.AsRow<{
	itemId: dbmage.Id
	stripeProductId: string
}>

export type OwnershipRow = dbmage.AsRow<{
	itemId: dbmage.Id
	userId: dbmage.Id
	time: number
}>
