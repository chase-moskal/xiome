
import {VideoTables} from "./video-tables.js"
import {UserAuth, UserMeta} from "../../auth/types/auth-metas.js"
import {PrivilegeChecker} from "../../auth/aspects/permissions/types/privilege-checker.js"
import {videoPrivileges} from "../api/video-privileges.js"

export interface VideoAuth extends Omit<UserAuth, "checker"> {
	videoTables: VideoTables
	checker: PrivilegeChecker<typeof videoPrivileges>
}

export interface VideoMeta extends UserMeta {}
