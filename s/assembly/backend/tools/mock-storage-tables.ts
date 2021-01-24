
import { dbbyMemory } from "../../../toolbox/dbby/dbby-memory.js"
import { makeDbbyStorage } from "../../../toolbox/dbby/dbby-storage.js"

import {objectMap} from "../../../toolbox/object-map.js"
import {SimpleStorage} from "../../../toolbox/json-storage.js"

export function mockStorageTables<T extends {[key: string]: true}>(
		storage: SimpleStorage,
		blueprint: T,
	) {

	return objectMap(blueprint, (value, key) => dbbyMemory({
		dbbyStorage: makeDbbyStorage(storage, key)
	}))
}
