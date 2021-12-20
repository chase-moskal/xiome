
import {storePrivileges} from "../../../store-privileges.js"
import {prepareRequiredPrivilege} from "../../../../../framework/api/prepare-required-privilege.js"

export const requiredPrivilege = prepareRequiredPrivilege<typeof storePrivileges>()
