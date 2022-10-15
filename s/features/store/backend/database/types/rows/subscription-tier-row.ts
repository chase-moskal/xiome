
import * as dbmage from "dbmage"

export type SubscriptionTierRow = dbmage.AsRow<{
	connectId: dbmage.Id

	tierId: dbmage.Id
	stripeProductId: string
	planId: dbmage.Id
	roleId: dbmage.Id

	label: string
	time: number
}>
