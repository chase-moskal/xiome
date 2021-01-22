
import {AccessPayload} from "../../auth-types.js"

export type AccessEventListener = (access: AccessPayload) => void | Promise<void>
