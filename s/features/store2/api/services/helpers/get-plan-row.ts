
import * as dbmage from "dbmage"
import {StoreLinkedAuth} from "../../types.js"


export async function getPlanRow({planId, auth}: {
		planId: string
		auth: StoreLinkedAuth
	}) {

	const planRow = await auth.storeDatabase.tables.subscriptions
		.plans.readOne(dbmage.find({planId: dbmage.Id.fromString(planId)}))

	if (!planRow)
		throw new Error(`subscription plan not found "${planId.toString()}"`)

	return planRow
}
