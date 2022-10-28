
import * as dbmage from "dbmage"

export type SubscriptionTierRow = dbmage.AsRow<{
	tierId: dbmage.Id
	stripeProductId: string
	planId: dbmage.Id
	roleId: dbmage.Id
	time: number
}>
