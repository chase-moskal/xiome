
import {apiContext} from "renraku/x/api/api-context.js"
import {shoppingTopic} from "../topics/shopping-topic.js"
import {StoreApiOptions} from "./types/store-api-options.js"
import {shopkeepingTopic} from "../topics/shopkeeping-topic.js"
import {stripeConnectTopic} from "../topics/stripe-connect-topic.js"

import {payPolicies} from "./policies/store-policies.js"
import {MerchantAuth} from "./policies/types/contexts/merchant-auth.js"
import {MerchantMeta} from "./policies/types/contexts/merchant-meta.js"
import {CustomerMeta} from "./policies/types/contexts/customer-meta.js"
import {CustomerAuth} from "./policies/types/contexts/customer-auth.js"
import {ClerkMeta} from "./policies/types/contexts/clerk-meta.js"
import {ClerkAuth} from "./policies/types/contexts/clerk-auth.js"
import {ProspectMeta} from "./policies/types/contexts/prosect-meta.js"
import {ProspectAuth} from "./policies/types/contexts/prosect-auth.js"
import {statusCheckerTopic} from "../topics/status-checker-topic.js"
import {statusTogglerTopic} from "../topics/status-toggler-topic.js"

export const storeApi = ({
		rando,
		tables,
		config,
		authPolicies,
		stripeComplex,
		shoppingOptions,
		stripeConnectOptions,
	}: StoreApiOptions) => {

	const policies = payPolicies({
		tables,
		authPolicies,
		stripeComplex,
	})

	return {
		stripeConnectService: apiContext<MerchantMeta, MerchantAuth>()({
			policy: policies.merchant,
			expose: stripeConnectTopic(stripeConnectOptions),
		}),
		shopkeepingService: apiContext<ClerkMeta, ClerkAuth>()({
			policy: policies.clerk,
			expose: shopkeepingTopic({
				generateId: () => rando.randomId(),
			}),
		}),
		shoppingService: apiContext<CustomerMeta, CustomerAuth>()({
			policy: policies.customer,
			expose: shoppingTopic(shoppingOptions),
		}),
		ecommerce: {
			statusTogglerService: apiContext<ClerkMeta, ClerkAuth>()({
				policy: policies.clerk,
				expose: statusTogglerTopic(),
			}),
			statusCheckerService: apiContext<ProspectMeta, ProspectAuth>()({
				policy: policies.prospect,
				expose: statusCheckerTopic({config}),
			}),
		}
	}
}
