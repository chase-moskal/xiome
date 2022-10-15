
import * as dbmage from "dbmage"

export type ConnectAccountRow = dbmage.AsRow<{
	connectId: dbmage.Id

	stripeAccountId: string
	charges_enabled: boolean
	payouts_enabled: boolean
	details_submitted: boolean
	email: undefined | string

	paused: boolean
	time: number
	userId: dbmage.Id
}>
