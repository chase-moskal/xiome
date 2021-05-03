
import {questionsPrivileges} from "../../../../../../features/questions/api/questions-privileges.js"
import {storePrivileges} from "../../../../../../features/store/permissions/store-privileges.js"

export const staffPrivileges = {
	...storePrivileges,
	// ...questionsPrivileges.moderator,
	"customize permissions": "7zk5csW78DHXHbFKzGdYfthYmTkwWKtGD7YnqPswW9Twm5FK",
}
