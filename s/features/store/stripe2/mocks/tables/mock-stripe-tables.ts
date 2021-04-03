
import {Stripe} from "stripe"
import {dbbyX} from "../../../../../toolbox/dbby/dbby-x.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {objectMap2} from "../../../../../toolbox/object-map.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {FlexibleDbbyRow} from "./types/rows/dbby-bespoke/flexible-dbby-row.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockStripeTables({tableStorage}: {tableStorage: FlexStorage}) {

	type Flexible<X extends FlexibleDbbyRow> = X & FlexibleDbbyRow

	const spec = {
		prices: <Stripe.Price>undefined,
		accounts: <Stripe.Account>undefined,
		products: <Stripe.Product>undefined,
		customers: <Stripe.Customer>undefined,
		setupIntents: <Stripe.SetupIntent>undefined,
		subscriptions: <Stripe.Subscription>undefined,
		paymentMethods: <Stripe.PaymentMethod>undefined,
		checkoutSessions: <Stripe.Checkout.Session>undefined,
	}

	const tables = await concurrent(
		objectMap2<
			typeof spec,
			{[P in keyof typeof spec]:
				Promise<DbbyTable<Flexible<Partial<(typeof spec)[P]>>>>}
		>(
			spec,
			(value, key) => dbbyX<Flexible<any>>(tableStorage, `mock-stripe-${key}`)
		)
	)

	return tables
}
