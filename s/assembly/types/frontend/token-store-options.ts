
import {Business} from "renraku/x/types/primitives/business.js"

import {SimpleStorage} from "../../../toolbox/json-storage.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"

export interface TokenStoreOptions {
	storage: SimpleStorage
	authorize: Business<ReturnType<typeof loginTopic>>["authorize"]
}
