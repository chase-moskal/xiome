
import {Rando} from "../../../../toolbox/get-rando.js"
import {StripeLiaison} from "../types/stripe-liaison.js"
import {StripeWebhooks} from "../types/stripe-webhooks.js"
import {mockLiaisonUtils} from "./utils/mock-liaison-utils.js"
import {MockStripeTables} from "./tables/types/mock-stripe-tables.js"
import {prepareConstrainTables} from "../../../../toolbox/dbby/dbby-constrain.js"
import {StripeLiaisonPlatform} from "../types/stripe-liaison-platform.js"
import {StripeLiaisonConnected} from "../types/stripe-liaison-connected.js"

export function mockStripeLiaison({rando, webhooks, mockStripeTables}: {
		rando: Rando
		webhooks: StripeWebhooks
		mockStripeTables: MockStripeTables
	}): StripeLiaison {

	const utils = mockLiaisonUtils({rando, tables: mockStripeTables})
	const platform: StripeLiaisonPlatform = {
		accounting: {},
	}

	function connect(stripeConnectAccountId: string): StripeLiaisonConnected {
		const utils = mockLiaisonUtils({
			rando,
			tables: prepareConstrainTables(mockStripeTables)({
				"_connectedAccount": stripeConnectAccountId,
			})
		})
		return {
			checkouts: {},
			customers: {},
			products: {},
			subscriptions: {}
		}
	}

	return {platform, connect}
}
