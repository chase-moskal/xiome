
import {VideoSchema} from "./video-schema.js"
import {videoPrivileges} from "../api/video-privileges.js"
import {UserAuth, UserMeta} from "../../auth/types/auth-metas.js"
import {PrivilegeChecker} from "../../auth/aspects/permissions/types/privilege-checker.js"
import {PermissionsEngine} from "../../../assembly/backend/permissions/types/permissions-engine.js"

export interface VideoAuth extends Omit<UserAuth, "checker"> {
	videoTables: VideoSchema
	engine: PermissionsEngine
	checker: PrivilegeChecker<typeof videoPrivileges>
}

export interface VideoMeta extends UserMeta {}
