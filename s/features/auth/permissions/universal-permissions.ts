
import {buildHardPermissions} from "./infrastructure/build-hard-permissions.js"

export const universalPermissions = buildHardPermissions({
	roles: {
		"banned": {
			roleId: "40b8cb44d0c53d4c17e28aaac661ac325014486adab9126ff67b1d51b8fe7cc1",
			privileges: [
				"banned_from_public_visibility",
			],
		},
	},
	privileges: {
		"edit_any_profile": "e649430e7810c0de5a2bdf53e7960ef75bcd9df59e36129dc43963190f3b18c1",
		"edit_user_roles": "e977805a5e2a8efd8c2cbfdfabb9b15b2c7bbaa4e6fba714e5e52bae3923562d",
		"edit_permissions": "be5170c9dfbd7691b814cab5ce20c1480a967e4b0462d8da9391f7d75977a5d7",
		"banned_from_public_visibility": "47695268965339c433de5c4dbf69890d97c5f03df3b461b1750f02c7e5ff376a",
	},
})
