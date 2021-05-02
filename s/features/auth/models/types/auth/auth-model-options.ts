
import {loginTopic} from "../../../topics/login-topic.js"

import {Service} from "../../../../../types/service.js"
import {AuthMediator} from "../../../mediator/types/auth-mediator.js"

export interface AuthModelOptions {
	authMediator: AuthMediator
	loginService: Service<typeof loginTopic>
}
