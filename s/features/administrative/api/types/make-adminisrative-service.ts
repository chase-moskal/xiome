
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {AdminisrativeServiceParts} from "./administrative-service-parts.js"
import {AdministrativeApiOptions} from "../types/administrative-api-options.js"

export type MakeAdminisrativeService<xAuth extends UserAuth> =
	(options: AdministrativeApiOptions) => AdminisrativeServiceParts<xAuth>
