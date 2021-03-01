
import {AnonMeta} from "./anon-meta.js"
import {BaseUserMeta} from "../policies/base/types/contexts/base-user-meta.js"

export interface UserMeta extends AnonMeta, BaseUserMeta {}
