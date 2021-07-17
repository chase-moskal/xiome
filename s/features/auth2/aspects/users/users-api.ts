
import {asApi} from "renraku/x/identities/as-api.js"
import {AuthApiOptions} from "../../types/auth-api-options.js"

export function usersApi(options: AuthApiOptions) {
	return asApi({
		greenService: greenService(options),
		// loginService: loginService(options),
		// userService: userService(options),
		// personalService: personalService(options),
	})
}
