
import {Op} from "../../../../../framework/ops.js"
import {makeStoreModel} from "../../model/model.js"
import {TemplateSlots} from "../../../../../toolbox/template-slots.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"

export interface CatalogRenderingParams {
	modals: ModalSystem
	storeModel: ReturnType<typeof makeStoreModel>
	slots: TemplateSlots
	setOp: (op: Op<void>) => void
}
