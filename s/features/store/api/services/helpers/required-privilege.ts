
import {storePrivileges} from "../../../store-privileges.js"
import {StoreAuth} from "../../../types/store-metas-and-auths.js"
import {prepareRequiredPrivilege} from "../../../../../framework/api/prepare-required-privilege.js"

export const requiredPrivilege = prepareRequiredPrivilege<
	StoreAuth,
	typeof storePrivileges
>()
