
import {asPermissions, mutable, immutable} from "./permissions-helpers.js"

const commonPrivileges = {
	"read questions": "22M8Tcp2xMg9hN5YxKkbffXpNHScTCnPXSXztzRnPXbC9RsD",
	"post questions": "75KrRyRPRnZZZKrh2zcwB98MCsZX9HCwg66qrzYTSprdqSTf",
	"like questions": "8qpc7M8nGkscwcSSW8d6Z7FyKGsxB8W5PWt2PCzk2sSJGgYb",
	"report questions": "86qRZfryfMWSfRhmkWkpq6pRYWCybmyNsD8RfxS7RpTqXN9J",
}

const commonPowerPrivileges = {
	"edit any profile": "2Z5M2n7pg9nRhwztgqztK6rBTPnyfr6fxk6T29sdfRTNGTqp",
	"customize permissions": "5Y5sBg2JtqqWnPXq5xXYRDB2cFygtc9StwN7GSZsBXzDBNNW",
	"moderate questions": "5dHqPzNHGsYnbqkF252ZhWS25hwCGrBSS67RBpmfm7by9dGF",
	"view stats": "2DWWssJp7G88kH9swMPxSZ529mXqn6kFM7zFMS9yn5P5RkGZ",
	"administrate user roles": "6HpSB2ZGcCsDGwHHmHKZCqYgpPxSg5kyw8PYtx5R2m6zBxmt",
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
		...commonPowerPrivileges,
		"banned": "5BrX6GbqgzDnhsTGsX6xxqsxNSNdC2RzFZzntNXdGc7bmmkK",
	},
	roles: {
		"anonymous": {
			roleId: "2tcdnygHqf9YXdtXWnk5hrzTWH5z9ynp6S8SFHXgdd67THDS",
			public: true,
			assignable: false,
			hasPrivileges: {
				...immutable(INACTIVE, commonPrivileges),
				...immutable(INACTIVE, commonPowerPrivileges),
				"banned": {active: false, immutable: true},
				"read questions": {active: true, immutable: false},
			},
		},
		"authenticated": {
			roleId: "2NJPCdCByYJ9N2yPmY6TNypCbksyMwDhKtfhNKXRdsRPCMDK",
			public: false,
			assignable: false,
			hasPrivileges: {
				...mutable(active, commonPrivileges),
				...immutable(INACTIVE, commonPowerPrivileges),
				"banned": {active: false, immutable: true},
			},
		},
		"banned": {
			roleId: "8FN9yGdMCBptMMCqHTHSJJ6PHtwpBWmtdPGGDzbTKCqdzsHC",
			public: true,
			assignable: true,
			hasPrivileges: {
				...immutable(INACTIVE, commonPrivileges),
				...immutable(INACTIVE, commonPowerPrivileges),
				"banned": {active: true, immutable: true},
			},
		},
		"technician": {
			roleId: "9DTMZY2NJm9HXMS7Tc2MYBf5HqcKWD98yNdZFNPrRhtb6yFq",
			public: true,
			assignable: false,
			hasPrivileges: {
				...immutable(active, commonPrivileges),
				...immutable(active, commonPowerPrivileges),
				"banned": {active: false, immutable: true},
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
		"anonymous": {
			...universalPermissions.roles.anonymous,
			hasPrivileges: {
				...universalPermissions.roles.anonymous.hasPrivileges,
				...immutable(INACTIVE, platformPowerPrivileges),
			}
		},
		"authenticated": {
			...universalPermissions.roles.authenticated,
			hasPrivileges: {
				...universalPermissions.roles.authenticated.hasPrivileges,
				...immutable(INACTIVE, platformPowerPrivileges),
			}
		},
		"banned": {
			...universalPermissions.roles.banned,
			hasPrivileges: {
				...universalPermissions.roles.banned.hasPrivileges,
				...immutable(INACTIVE, platformPowerPrivileges),
			}
		},
		"technician": {
			...universalPermissions.roles.technician,
			hasPrivileges: {
				...universalPermissions.roles.technician.hasPrivileges,
				...immutable(active, commonPrivileges),
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
		"anonymous": {
			...universalPermissions.roles.anonymous,
			hasPrivileges: {
				...universalPermissions.roles.anonymous.hasPrivileges,
				...immutable(INACTIVE, appPowerPrivileges),
			}
		},
		"authenticated": {
			...universalPermissions.roles.authenticated,
			hasPrivileges: {
				...universalPermissions.roles.authenticated.hasPrivileges,
				...immutable(INACTIVE, appPowerPrivileges),
			}
		},
		"banned": {
			...universalPermissions.roles.banned,
			hasPrivileges: {
				...universalPermissions.roles.banned.hasPrivileges,
				...immutable(INACTIVE, appPowerPrivileges),
			}
		},
		"admin": {
			roleId: "7KWz2MKkFynJ5FNBG86tChyXwGDkpBZcdJxCxpkmhrmnScqm",
			public: true,
			assignable: false,
			hasPrivileges: {
				...immutable(active, appPowerPrivileges),
				...immutable(active, commonPrivileges),
				...immutable(active, commonPowerPrivileges),
				"banned": {active: false, immutable: true},
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
