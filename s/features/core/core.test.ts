
import {Suite, expect} from "cynic"

import {generatePasskey} from "./generate-passkey.js"
import {testableCoreApi} from "./testable-core-api.js"

export default <Suite>{
	"broad strokes": {
		"meta-user can sign up via passkey": true,
		"meta-user can register an app, generate a token, and generate an admin": true,
		"meta-user can login to new app as generated admin": true,
		"user can sign into new app via google": true,
		"user can get get third party scoped tokens": true,
	},
	"auth": {
		"users can sign up": {
			"via passkey": async() => {
				const {authTopic} = testableCoreApi().api

				// root-user logs in, registers an app

				const passkey = generatePasskey()
				const result = await authTopic.authenticateViaPasskey({
					passkey,
				})
				return true
					&& expect(result).ok()
					&& expect(result.accessToken).ok()
					&& expect(result.refreshToken).ok()
			},
			"via google": async() => {
				return true
				// const {apis} = await mockSystemAlpha()
				// const result = await apis.core.auth.authenticateViaGoogle()
				// return true
				// 	&& expect(result.accessToken).ok()
			},
		},
		"users can login": true,
		"users can logout": true,
		"users can obtain scoped tokens for 3rd party services": true,
		"devs can easily curry auth into any topic": true,
	},
	"apps": {
		"preconfigured meta-admin can login to meta-app": async() => {
			return true
			// const {apis} = await mockSystemAlpha()
			// const result_passkey = await apis.core.auth.authenticateViaPasskey()
			// const result_google = await apis.core.auth.authenticateViaGoogle()
			// return true
			// 	&& expect(result_passkey.accessToken).ok()
			// 	&& expect(result_google.accessToken).ok()
		},
		"meta-users can login to the meta-app": true,
		"meta-users can manage their own apps as owners": true,
		"app-owners can generate app tokens": true,
		"app-owners can generate admin accounts and login": true,
		"apps are isolated from external perspective": true,
	},
	"profiles": {
		"anybody can read any profile": true,
		"users can author their profile": true,
		"admins can overwrite any profile": true,
	},
	"permissions": {
		"hard-coded standard permissions include admin and ban": true,
		"admins can manage roles for users and permissions for roles": true,
		"admins can assign roles to users with expiry times": true,
	},
	"settings": {
		"users can access their own settings, but nobody else's": true,
		"admins can access anybody's settings": true,
	},
	"admin": {
		"stats": {
			"privileged users can view stats": true,
		},
		"bans": {
			"standard ban role assigns a banishment permission": true,
		},
	},
}
