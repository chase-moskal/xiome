
import * as dbmage from "dbmage"

export type SubscriptionPlanRow = dbmage.AsRow<{
	connectId: dbmage.Id

	planId: dbmage.Id

	label: string
	time: number
	archived: boolean
}>
