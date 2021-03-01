
import {AccessPayload} from "../../types/AccessPayload"

export type AccessEventListener = (access: AccessPayload) => void | Promise<void>
