
import {Stripe} from "stripe"
import * as dbmage from "dbmage"


import {StoreLinkedAuth} from "../../../types.js"
import {getStripeId} from "../../../../stripe/liaison/helpers/get-stripe-id.js"
import {SubscriptionPlanRow, SubscriptionTierRow} from "../../../../types/store-schema.js"

export async function reconstructStripeSubscriptionItems({
		auth,
		tierRow,
		planRow,
		stripeSubscription,
	}: {
		auth: StoreLinkedAuth
		tierRow: SubscriptionTierRow
		planRow: SubscriptionPlanRow
		stripeSubscription: Stripe.Subscription
	}) {

	const allTierRowsRelatedToPlan = await auth.storeDatabase.tables
		.subscriptions.tiers.read(dbmage.find({
			planId: planRow.planId,
		}))

	const itemsToKeep = stripeSubscription.items.data
		.filter(item => {
			const itemIsRelatedToPlan = allTierRowsRelatedToPlan
				.find(row => row.stripePriceId === getStripeId(item.price.id))
			return !itemIsRelatedToPlan
		})

	const newItems: Stripe.SubscriptionCreateParams["items"] = [
		...itemsToKeep.map(i => ({
			price: getStripeId(i.price.id),
			quantity: 1,
		})),
		{
			price: tierRow.stripePriceId,
			quantity: 1,
		},
	]

	return newItems
}
