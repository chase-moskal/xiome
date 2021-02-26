
import Stripe from "stripe"
import {UpdateFlow} from "./update-flow.js"

export type SetupMetadata = Stripe.Metadata & {
	flow: UpdateFlow
}
