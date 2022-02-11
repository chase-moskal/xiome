
import * as dbmage from "dbmage"
import * as renraku from "renraku"
import {CardClues} from "../../stripe/liaison/types/card-clues.js"
import {StoreServiceOptions} from "../../types/store-concepts.js"

export const makeBillingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storeLinkedPolicy)

.expose(({access, database, stripeLiaisonAccount}) => ({

	async checkoutPaymentMethod() {
		const session = await stripeLiaisonAccount.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "setup",
			customer: "",

			// TODO implement session urls
			success_url: "TODO",
			cancel_url: "TODO",
		})
		return {
			stripeSessionUrl: session.url,
		}
	},

	async getPaymentMethodDetails() {
		const paymentMethod = await database.tables.store.billing.paymentMethods.readOne(dbmage.find({
			userId: dbmage.Id.fromString(access.user.userId),
		}))
		if (paymentMethod) {
			const stripePaymentMethod = await stripeLiaisonAccount.paymentMethods.retrieve(
				paymentMethod.stripePaymentMethodId
			)
			return {
				cardClues: <CardClues>{
					brand: stripePaymentMethod.card.brand,
					country: stripePaymentMethod.card.country,
					expireMonth: stripePaymentMethod.card.exp_month,
					expireYear: stripePaymentMethod.card.exp_year,
					last4: stripePaymentMethod.card.last4,
				}
			}
		}
	},

	async disconnectPaymentMethod() {
		const userId = dbmage.Id.fromString(access.user.userId)
		const paymentMethod = await database.tables.store.billing.paymentMethods.readOne(dbmage.find({
			userId,
		}))
		if (paymentMethod) {
			await stripeLiaisonAccount.paymentMethods.detach(
				paymentMethod.stripePaymentMethodId
			)
			await database.tables.store.billing.paymentMethods.delete(dbmage.find({
				userId,
			}))
		}
	},
}))
