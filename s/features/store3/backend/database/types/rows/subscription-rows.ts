
import * as dbmage from "dbmage"

export type SubscriptionPlanRow = dbmage.AsRow<{
	planId: dbmage.Id
	label: string
	time: number
	archived: boolean
}>

export type SubscriptionTierRow = dbmage.AsRow<{
	label: string
	tierId: dbmage.Id
	planId: dbmage.Id
	roleId: dbmage.Id
	time: number
	stripeProductId: string
}>
