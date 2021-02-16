
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"

export interface TokenStoreOptions {
	appId: string
	storage: FlexStorage
	publishAppTokenChange: () => void | Promise<void>
	publishAuthTokenChange: () => void | Promise<void>
}
