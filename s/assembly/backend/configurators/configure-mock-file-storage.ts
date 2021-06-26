
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {nodeFileFlexStorage} from "../../../toolbox/flex-storage/node-file-flex-storage.js"

export function configureMockFileStorage(path: string): FlexStorage {
	return nodeFileFlexStorage(path)
}
