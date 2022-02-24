
// import {Stripe} from "stripe"
// import * as dbmage from "dbmage"

// import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"
// import {getStripeId} from "../../../stripe/liaison/helpers/get-stripe-id.js"
// import {getRowsForTierId} from "./get-rows-for-tier-id.js"

// export async function obtainSubscriptionInfoByTierId({tierId, auth}: {
// 		tierId: string
// 		auth: StoreLinkedAuth
// 	}) {

// 	const storeTables = auth.database.tables.store
// 	const {tierRow, planRow} = await getRowsForTierId({tierId, auth})

// 	const allTierRowsRelatedToPlan = await storeTables.subscriptions
// 		.tiers.read(dbmage.find({
// 			planId: planRow.planId,
// 		}))

// 	const alreadyOwned = auth.access.permit
// 			.privileges.includes(tierRow.roleId.string)
// 		|| auth.access.permit
// 			.privileges.includes(planRow.roleId.string)

// 	if (alreadyOwned)
// 		throw new Error(`user already owns subscription "${planRow.label}: ${tierRow.label}"`)

// 	const customer = <Stripe.Customer>await auth.stripeLiaisonAccount.customers.retrieve(auth.stripeCustomerId)
// 	const stripePaymentMethodId = getStripeId(customer.invoice_settings.default_payment_method)

// 	const stripeSubscriptions = await auth.stripeLiaisonAccount
// 		.subscriptions.list({customer: auth.stripeCustomerId})

// 	const [stripeSubscription] = stripeSubscriptions?.data ?? []

// 	return {
// 		tierRow,
// 		planRow,
// 		allTierRowsRelatedToPlan,
// 		stripeSubscription,
// 		stripePaymentMethodId,
// 	}
// }
