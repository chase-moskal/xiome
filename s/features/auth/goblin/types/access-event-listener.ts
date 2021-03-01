
import {AccessPayload} from "../../types/auth-types.js"

export type AccessEventListener = (access: AccessPayload) => void | Promise<void>
