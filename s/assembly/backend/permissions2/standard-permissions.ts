
import {asPermissions, mutable, immutable, has} from "./permissions-helpers.js"

const commonPrivileges = {
	"read questions": "22M8Tcp2xMg9hN5YxKkbffXpNHScTCnPXSXztzRnPXbC9RsD",
	"post questions": "75KrRyRPRnZZZKrh2zcwB98MCsZX9HCwg66qrzYTSprdqSTf",
	"like questions": "8qpc7M8nGkscwcSSW8d6Z7FyKGsxB8W5PWt2PCzk2sSJGgYb",
}

const powerPrivileges = {
	"edit any profile": "2Z5M2n7pg9nRhwztgqztK6rBTPnyfr6fxk6T29sdfRTNGTqp",
	"customize permissions": "5Y5sBg2JtqqWnPXq5xXYRDB2cFygtc9StwN7GSZsBXzDBNNW",
	"moderate questions": "5dHqPzNHGsYnbqkF252ZhWS25hwCGrBSS67RBpmfm7by9dGF",
}

const platformPowerPrivileges = {
	"edit any app": "77nZH9ksyDDBf6ptNZ9MNZzJdfMyWfG5PYbYwmmX6kTGMhkw",
	"view platform stats": "2nth28xGTC6TbPNzCHf72pRchr8FpPyDbwMRTnTsppPk9DC8",
}

const appPowerPrivileges = {
	"manage store": "658Kh8yMybF8hNr55JGkbCYtwyJpFd6MfRhFPcYdGskbtbzG",
	"give away freebies": "8R5fFWCJy8PMDJsPNkn8HqzpMGHBkMMfXz9HCzx7XdnrcKzJ",
}

const active = true
const INACTIVE = false

export const universalPermissions = asPermissions({
	privileges: {
		...commonPrivileges,
		...powerPrivileges,
		"banned": "5BrX6GbqgzDnhsTGsX6xxqsxNSNdC2RzFZzntNXdGc7bmmkK",
	},
	roles: {
		"anonymous": {
			roleId: "2tcdnygHqf9YXdtXWnk5hrzTWH5z9ynp6S8SFHXgdd67THDS",
			hasPrivileges: {
				"read questions": {active: true, immutable: false},
			},
		},
		"user": {
			roleId: "2NJPCdCByYJ9N2yPmY6TNypCbksyMwDhKtfhNKXRdsRPCMDK",
			hasPrivileges: {
				...mutable(active, commonPrivileges),
			},
		},
		"technician": {
			roleId: "9DTMZY2NJm9HXMS7Tc2MYBf5HqcKWD98yNdZFNPrRhtb6yFq",
			hasPrivileges: {
				...immutable(active, commonPrivileges),
				...immutable(active, powerPrivileges),
			},
		},
	},
})

export const platformPermissions = asPermissions({
	privileges: {
		...universalPermissions.privileges,
		...platformPowerPrivileges,
	},
	roles: {
		...universalPermissions.roles,
		"technician": {
			...universalPermissions.roles.technician,
			hasPrivileges: {
				...universalPermissions.roles.technician.hasPrivileges,
				...immutable(active, platformPowerPrivileges),
			},
		},
	},
})

export const appPermissions = asPermissions({
	privileges: {
		...universalPermissions.privileges,
		...appPowerPrivileges,
	},
	roles: {
		...universalPermissions.roles,
		"admin": {
			roleId: "7KWz2MKkFynJ5FNBG86tChyXwGDkpBZcdJxCxpkmhrmnScqm",
			hasPrivileges: {
				...immutable(active, appPowerPrivileges),
				"customize permissions": {active: true, immutable: true},
			},
		},
		"technician": {
			...universalPermissions.roles.technician,
			hasPrivileges: {
				...universalPermissions.roles.technician.hasPrivileges,
				...immutable(active, appPowerPrivileges),
			},
		},
	},
})
