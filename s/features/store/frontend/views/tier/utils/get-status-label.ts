
import {SubscriptionStatus} from "../../../../isomorphic/concepts.js"

export function getStatusLabel(status: SubscriptionStatus) {
	switch (status) {

		case SubscriptionStatus.Unsubscribed:
			return undefined

		case SubscriptionStatus.Active:
			return "active"

		case SubscriptionStatus.Unpaid:
			return "unpaid"

		case SubscriptionStatus.Cancelled:
			return "cancelled"
	}
}
