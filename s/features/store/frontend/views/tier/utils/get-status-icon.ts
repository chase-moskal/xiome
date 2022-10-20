
import {SubscriptionStatus} from "../../../../isomorphic/concepts.js"

import checkSvg from "../../../../../../framework/icons/check.svg.js"
import crossSvg from "../../../../../../framework/icons/cross.svg.js"
import warningSvg from "../../../../../../framework/icons/warning.svg.js"

export function getStatusIcon(status: SubscriptionStatus) {
	switch (status) {

		case SubscriptionStatus.Unsubscribed:
			return undefined

		case SubscriptionStatus.Active:
			return {
				name: "check",
				svg: checkSvg,
			}

		case SubscriptionStatus.Unpaid:
			return {
				name: "warning",
				svg: warningSvg,
			}

		case SubscriptionStatus.Cancelled:
			return {
				name: "x",
				svg: crossSvg,
			}
	}
}
