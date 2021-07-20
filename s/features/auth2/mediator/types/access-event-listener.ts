
import {AccessPayload} from "../../types/auth-tokens.js"

export type AccessEventListener = (access: AccessPayload) => void | Promise<void>
