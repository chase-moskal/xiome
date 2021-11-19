
import {asApi} from "renraku/x/identities/as-api.js"
import {Policy} from "renraku/x/types/primitives/policy.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"

import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {StoreTables} from "./tables/types/store-tables.js"
import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
import {makeShoppingService} from "./services/shopping-service.js"
import {StoreAuth, StoreMeta} from "./types/store-metas-and-auths.js"
import {makeStripeLiaison} from "../stripe2/liaison/stripe-liaison.js"
import {makeShopkeepingService} from "./services/shopkeeping-service.js"
import {makeStripeConnectService} from "./services/stripe-connect-service.js"
import {makeStatusTogglerService} from "./services/status-toggler-service.js"
import {makeStatusCheckerService} from "./services/status-checker-service.js"
import {StoreCommonOptions, StoreServiceOptions} from "./types/store-options.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export const storeApi = ({
		storeTables,
		stripeLiaison,
		basePolicy,
		...common
	}: {
		storeTables: UnconstrainedTables<StoreTables>
		stripeLiaison: ReturnType<typeof makeStripeLiaison>
		basePolicy: Policy<AnonMeta, AnonAuth>
	} & StoreCommonOptions) => {

	async function storePolicy(
			meta: StoreMeta,
			request: HttpRequest
		): Promise<StoreAuth> {
		const auth = await basePolicy(meta, request)
		return {
			...auth,
			stripeLiaison,
			storeTables: storeTables.namespaceForApp(
				DamnId.fromString(auth.access.appId)
			),
		}
	}

	const serviceOptions: StoreServiceOptions = {
		...common,
		storePolicy,
		async storeLinkedPolicy(meta, request) {
			const auth = await storePolicy(meta, request)
			const {stripeAccountId} = await auth.storeTables.merchant
				.stripeAccounts
					.one({conditions: false})
			return {
				...auth,
				stripeLiaisonAccount: stripeLiaison.account(stripeAccountId),
			}
		},
	}

	return asApi({
		stripeConnectService: makeStripeConnectService(serviceOptions),
		statusTogglerService: makeStatusTogglerService(serviceOptions),
		statusCheckerService: makeStatusCheckerService(serviceOptions),
		shopkeepingService: makeShopkeepingService(serviceOptions),
		shoppingService: makeShoppingService(serviceOptions),
	})
}
