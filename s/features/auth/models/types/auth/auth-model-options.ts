
import {loginTopic} from "../../../topics/login-topic.js"

import {Service} from "../../../../../types/service.js"
import {AuthGoblin} from "../../../goblin/types/auth-goblin.js"

export interface AuthModelOptions {
	authGoblin: AuthGoblin
	loginService: Service<typeof loginTopic>
}
