import {BaseUserAuth} from "../policies/base/types/contexts/base-user-auth.js"
import {AnonAuth} from "./AnonAuth.js"


export interface UserAuth extends AnonAuth, BaseUserAuth {}
