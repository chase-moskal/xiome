
import {questionsPrivileges} from "../../../../../features/questions/api/questions-privileges.js"
import {anybodyPrivileges} from "./privilege-groups/anybody-privileges.js"
import {powerPrivileges} from "./privilege-groups/power-privileges.js"
import {userPrivileges} from "./privilege-groups/user-privileges.js"

export const universalPrivileges = {
	...userPrivileges,
	...powerPrivileges,
	...anybodyPrivileges,
	...questionsPrivileges.anybody,
	...questionsPrivileges.user,
	...questionsPrivileges.moderator,
	"banned": "2D2CHFmR7cm77xz6Y9hChWgNr5SkFf8zhXds69sqcNYfcGWS",
}
