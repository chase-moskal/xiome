
import {Service} from "../../../types/service.js"
import {SimpleStorage} from "../../../toolbox/json-storage.js"
import {loginTopic} from "../../../features/auth/topics/login-topic.js"

export interface TokenStoreOptions {
	storage: SimpleStorage
	authorize: Service<typeof loginTopic>["authorize"]
}
