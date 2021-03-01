
import {AccessPayload} from "../../types/access-payload.js"

export type AccessEventListener = (access: AccessPayload) => void | Promise<void>
