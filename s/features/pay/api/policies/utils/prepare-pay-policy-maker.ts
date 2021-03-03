
import {Policy} from "renraku/x/types/primitives/policy.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"

import {prepareNamespacerForTables} from "../../../../auth/tables/baking/generic/prepare-namespacer-for-tables.js"

import {PayPolicyOptions} from "../types/pay-policy-options.js"
import {UserAuth} from "../../../../auth/policies/types/user-auth.js"
import {UserMeta} from "../../../../auth/policies/types/user-meta.js"
import {PayAuthSpecifics} from "../types/contexts/specifics/pay-auth-specifics.js"

export function preparePayPolicyMaker(options: PayPolicyOptions) {
	const bakeBillingTables = prepareNamespacerForTables(options.tables.billing)

	async function processPayAuth<xAuth extends UserAuth>(auth: xAuth, appId: string):
			Promise<xAuth & PayAuthSpecifics> {
		const tables = {
			...auth.tables,
			billing: await bakeBillingTables(appId),
		}
		const stripeLiaison = await options.makeStripeLiaison({tables})
		return {...auth, tables, stripeLiaison}
	}

	function preparePayPolicy<
				xMeta extends UserMeta,
				xInAuth extends UserAuth,
				xOutAuth extends PayAuthSpecifics & xInAuth
			>(
				policy: Policy<xMeta, xInAuth>,
				workOnAuth: (
						meta: xMeta,
						auth: PayAuthSpecifics & xInAuth,
						request: HttpRequest,
					) => Promise<xOutAuth>
						= async(meta, auth, request) => <xOutAuth>auth,
			): Policy<xMeta, xOutAuth> {
		return {
			processAuth: async(meta, request) => {
				const auth = await policy.processAuth(meta, request)
				const auth2 = await processPayAuth<xInAuth>(auth, auth.app.appId)
				return workOnAuth(meta, auth2, request)
			},
		}
	}

	return {preparePayPolicy, bakeBillingTables}
}
