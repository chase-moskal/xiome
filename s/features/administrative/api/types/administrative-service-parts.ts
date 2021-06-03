
import {Topic} from "renraku/x/types/primitives/topic.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"

export interface AdminisrativeServiceParts<xAuth extends UserAuth> {
	policy: (auth: UserAuth) => Promise<xAuth>
	expose: Topic<xAuth>
}
