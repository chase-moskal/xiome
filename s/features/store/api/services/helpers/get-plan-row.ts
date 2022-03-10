
import * as dbmage from "dbmage"
import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"

export async function getPlanRow({planId, auth}: {
		planId: string
		auth: StoreLinkedAuth
	}) {

	const planRow = await auth.database.tables.store.subscriptions
		.plans.readOne(dbmage.find({planId: dbmage.Id.fromString(planId)}))

	if (!planRow)
		throw new Error(`subscription plan not found "${planId.toString()}"`)

	return planRow
}
