
import * as dbmage from "dbmage"

export type SubscriptionPlanRow = dbmage.AsRow<{
	planId: dbmage.Id

	label: string
	time: number
	archived: boolean
}>
