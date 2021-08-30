
import {Await} from "../../../../types/await.js"
import {assembleModels} from "../../models/assemble-models.js"
import {ModalSystem} from "../../modal/types/modal-system.js"

export interface XiomeComponentOptions {
	modals: ModalSystem
	models: Await<ReturnType<typeof assembleModels>>
}
