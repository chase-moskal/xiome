
import {Suite} from "cynic"

export default <Suite>{
	"features": {

		"core": {
			"apps": {
				"preconfigured meta-owner can login to meta-app": true,
				"meta-users can login to the meta-app": true,
				"meta-users can manage their own apps as owners": true,
				"app-owners can generate app tokens": true,
				"app-owners can generate admin accounts and login": true,
				"apps are isolated from external perspective": true,
			},
			"auth": {
				"users can sign up": true,
				"users can login": true,
				"users can logout": true,
				"devs can easily curry auth into any topic": true,
			},
			"profiles": {
				"anybody can read any profile": true,
				"users can author their profile": true,
				"admins can overwrite any profile": true,
			},
			"permissions": {
				"admins can manage roles and permissions": true,
				"admins can choose configure feature privilege levels": true,
			},
		},

		"media": {
			"admins can manage a library of media items (vimeo videos)": true,
			"admins can set privilege levels on media items": true,
			"users can view media when they have the right privileges": true,
		},
	},
}
