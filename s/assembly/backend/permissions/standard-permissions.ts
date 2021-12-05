
import {asPermissions, mutable, immutable} from "./permissions-helpers.js"
import {storePowerPrivileges} from "../../../features/store/store-privileges.js"
import {videoPowerPrivileges} from "../../../features/videos/api/video-privileges.js"
import {chatPowerPrivileges, chatRegularPrivileges} from "../../../features/chat/common/chat-privileges.js"

export const universalPrivilege = "c1cb5ac1000af6081ff47e80804de7542b57a1425c3faac8153e708aaf79271a"

const commonPrivileges = {
	"read questions": "5b19b929648cbbe26c052a5016892b370f048eead1e6a303a50b7f5234ec5161",
	"post questions": "aeaae6139d05f77193ca7c272a65977c70cb188f3070359866237a5ade84ba15",
	"like questions": "5490898c541d733956b28664e7536673842e73b289fc45ab9caf143138c14a3e",
	"report questions": "f2f89d433f398b267e320e0e3b9929eb3934af5c02f7e3fb2e032fd19399ad21",
	...chatRegularPrivileges,
}

const commonPowerPrivileges = {
	"edit any profile": "4240ca0331e8679a444c6c4c6a803d8a12893f1554460af426064b980164c8ee",
	"customize permissions": "f380d9b4d1001da8dc86a6e0b6a0721b92ed8060c52cd4ba433e76cbd9efe6b5",
	"answer questions": "afaa00f7bc9ab09d3bbc61a26f6d9bc666cd9bb7ac270ebbdeba3cf4dd3ab9a9",
	"moderate questions": "f6a3152a13f313a60f84d82ba8f7765afb19f70c04ef14688d802237a5d2ab5e",
	"view stats": "092866ae6378833e43ec7001188aa1829d4cf2858e42da0ad3f44a2fedbcb07b",
	"administrate user roles": "a072e9dd003a762e7d693658d8ac724be352b18da240843f691595c89020e350",
	...videoPowerPrivileges,
	...storePowerPrivileges,
	...chatPowerPrivileges,
}

const platformPowerPrivileges = {
	"edit any app": "e5fadb4b03badd6699b355ec43e1d150d6f4df81ecc291b5b742f06ebe62a0f8",
	"view platform stats": "eec7d2ddc20df6080c4166a3dea0b2643b483ce61326cbefad95e45824810692",
}

const appPowerPrivileges = {}

const active = true
const INACTIVE = false

export const universalPermissions = asPermissions({
	privileges: {
		...commonPrivileges,
		...commonPowerPrivileges,
		"universal": universalPrivilege,
		"banned": "ffff9ebcbe8f69f3520ec574f5a1489a70bf04521d7a85fcbd25c54cc22802f1",
	},
	roles: {
		"everybody": {
			roleId: "aaaa777dc7d7e9b5e9e0386abf0cf2f059cda4f71779cc910b85e8f504452b23",
			public: true,
			assignable: false,
			hasPrivileges: {
				...immutable(INACTIVE, commonPrivileges),
				...immutable(INACTIVE, commonPowerPrivileges),
				"universal": {active: true, immutable: true},
				"banned": {active: false, immutable: true},
				"read questions": {active: true, immutable: false},
				"view all chats": {active: true, immutable: false},
			},
		},
		"authenticated": {
			roleId: "bbbb642d549d06113953a01fb52a8e010150edc502b929395bfb32d250d44b1c",
			public: false,
			assignable: false,
			hasPrivileges: {
				...mutable(active, commonPrivileges),
				...immutable(INACTIVE, commonPowerPrivileges),
				"universal": {active: false, immutable: true},
				"banned": {active: false, immutable: true},
			},
		},
		"banned": {
			roleId: "dead633608412f8eefbb40f4678ef2bafaeb7883d09a6094dafe5f69dd6a8684",
			public: true,
			assignable: true,
			hasPrivileges: {
				...immutable(INACTIVE, commonPrivileges),
				...immutable(INACTIVE, commonPowerPrivileges),
				"universal": {active: false, immutable: true},
				"banned": {active: true, immutable: true},
			},
		},
		"technician": {
			roleId: "9999d97119a83ea3853273a93e24ae0a1f2a994eccb21dacacab6ff860d8d869",
			public: true,
			assignable: false,
			hasPrivileges: {
				...immutable(active, commonPrivileges),
				...immutable(active, commonPowerPrivileges),
				"universal": {active: false, immutable: true},
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
		"everybody": {
			...universalPermissions.roles.everybody,
			hasPrivileges: {
				...universalPermissions.roles.everybody.hasPrivileges,
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
		"everybody": {
			...universalPermissions.roles.everybody,
			hasPrivileges: {
				...universalPermissions.roles.everybody.hasPrivileges,
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
			roleId: "d21e66058b95b3b2e80c1a00c82abd56b8ec7a4b20f0424c2a00cc6ba352efeb",
			public: true,
			assignable: false,
			hasPrivileges: {
				...immutable(active, appPowerPrivileges),
				...immutable(active, commonPrivileges),
				...immutable(active, commonPowerPrivileges),
				"universal": {active: false, immutable: true},
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
