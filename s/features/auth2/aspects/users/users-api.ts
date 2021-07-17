
import {asApi} from "renraku/x/identities/as-api.js"
import {CommonAuthOptions} from "../../types/auth-options.js"

export function usersApi(options: CommonAuthOptions) {
	return asApi({
		greenService: greenService(options),
		// loginService: loginService(options),
		// userService: userService(options),
		// personalService: personalService(options),
	})
}
