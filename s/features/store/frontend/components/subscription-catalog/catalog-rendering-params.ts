
import {StoreModel} from "../../model/model.js"
import {Op} from "../../../../../framework/ops.js"
import {TemplateSlots} from "../../../../../toolbox/template-slots.js"
import {PaymentMethod, SubscriptionDetails} from "../../../isomorphic/concepts.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"

export interface CatalogRenderingParams {
	modals: ModalSystem
	paymentMethod: PaymentMethod
	billing: StoreModel["billing"]
	subscriptions: StoreModel["subscriptions"]
	mySubscriptionDetails: SubscriptionDetails[]
	slots: TemplateSlots
	setOp: (op: Op<void>) => void
}
