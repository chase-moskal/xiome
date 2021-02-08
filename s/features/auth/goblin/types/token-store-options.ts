
import {SimpleStorage} from "../../../../toolbox/json-storage.js"

export interface TokenStoreOptions {
	appId: string
	storage: SimpleStorage
	publishAppTokenChange: () => void | Promise<void>
	publishAuthTokenChange: () => void | Promise<void>
}
