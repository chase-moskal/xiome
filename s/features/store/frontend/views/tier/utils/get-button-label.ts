
import {TierButton} from "../types.js"

export function getButtonLabel(button: TierButton) {
	switch (button) {

		case TierButton.Buy:
			return "buy"

		case TierButton.Downgrade:
			return "downgrade"

		case TierButton.Upgrade:
			return "upgrade"

		case TierButton.Pay:
			return "pay"

		case TierButton.Cancel:
			return "cancel"

		case TierButton.Renew:
			return "renew"
	}
}
