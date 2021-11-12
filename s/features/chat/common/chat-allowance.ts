
import {chatPrivileges} from "./chat-privileges.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"

export function chatAllowance(privileges: string[]) {
	return {
		moderateAllChats:
			privileges.includes(chatPrivileges["moderate all chats"]),
	
		participateInAllChats:
			privileges.includes(chatPrivileges["moderate all chats"]) ||
			privileges.includes(chatPrivileges["participate in all chats"]),

		viewAllChats:
			privileges.includes(chatPrivileges["moderate all chats"]) ||
			privileges.includes(chatPrivileges["participate in all chats"]) ||
			privileges.includes(chatPrivileges["view all chats"]),

		banned:
			privileges.includes(appPermissions.privileges["banned"]),
	}
}
