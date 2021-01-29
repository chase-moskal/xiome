
import {TextInputValidator} from "../types/text-input-validator.js"
import {isValidEmail} from "../../../auth/tools/emails/is-valid-email.js"

export const emailValidator: TextInputValidator = email => {
	return email
		? isValidEmail(email)
			? []
			: ["email is invalid"]
		: ["email must be present"]
}
