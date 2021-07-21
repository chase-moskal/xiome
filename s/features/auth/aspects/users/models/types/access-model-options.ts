
import {Service} from "../../../../../../types/service.js"
import {makeLoginService} from "../../services/login-service.js"
import {AuthMediator} from "../../../../mediator/types/auth-mediator.js"

export interface AccessModelOptions {
	authMediator: AuthMediator
	loginService: Service<typeof makeLoginService>
}

