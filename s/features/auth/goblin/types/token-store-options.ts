
import {SimpleStorage} from "../../../../toolbox/json-storage.js"

export interface TokenStoreOptions {
	storage: SimpleStorage
	publishTokenChange: () => void | Promise<void>
}
