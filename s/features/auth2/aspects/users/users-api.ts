
import {asApi} from "renraku/x/identities/as-api.js"
import {AuthOptions} from "../../types/auth-options.js"
import {greenService} from "./services/green-service.js"

export function usersApi(options: AuthOptions) {
	return asApi({
		greenService: greenService(options),
		// loginService: loginService(options),
		// userService: userService(options),
		// personalService: personalService(options),
	})
}
