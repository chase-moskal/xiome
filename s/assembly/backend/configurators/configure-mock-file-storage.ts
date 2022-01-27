
import {FlexStorage} from "dbmage"
import {nodeFileFlexStorage} from "dbmage/x/flex-storage/node-file-flex-storage.js"

export function configureMockFileStorage(path: string): FlexStorage {
	return nodeFileFlexStorage(path)
}
