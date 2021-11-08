
export const chatRegularPrivileges = {
	"view all chats": "985dc13378d1129e4dd6303fe9e52dff97d53568ce10814805f481159c788710",
	"participate in all chats": "bd0c8dfdf3eef893a5d9f8b5d0a6cad19ad80e949ebd70428f0d7525099cdd10",
}

export const chatPowerPrivileges = {
	"moderate all chats": "693d969777a3998de6f9a4a5583917f4e672bb96ed08c571fc7486593ca98993",
}

export const chatPrivileges = {
	...chatRegularPrivileges,
	...chatPowerPrivileges,
}
