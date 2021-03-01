import {BaseUserMeta} from "../policies/base/types/contexts/base-user-meta.js"
import {AnonMeta} from "./AnonMeta.js"


export interface UserMeta extends AnonMeta, BaseUserMeta {}
