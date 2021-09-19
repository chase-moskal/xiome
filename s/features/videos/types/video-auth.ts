
import {VideoTables} from "./video-tables.js"
import {UserAuth, UserMeta} from "../../auth/types/auth-metas.js"

export interface VideoAuth extends UserAuth {
	videoTables: VideoTables
}

export interface VideoMeta extends UserMeta {}
