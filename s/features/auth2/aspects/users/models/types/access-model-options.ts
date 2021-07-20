
import {Service2} from "../../../../../../types/service2.js"
import {makeLoginService} from "../../services/login-service.js"
import {AuthMediator} from "../../../../mediator/types/auth-mediator.js"

export interface AccessModelOptions {
	authMediator: AuthMediator
	loginService: Service2<typeof makeLoginService>
}

