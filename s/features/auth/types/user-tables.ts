
import {AccountRow} from "../tables/types/rows/account-row.js"
import {ProfileRow} from "../tables/types/rows/profile-row.js"
import {LatestLoginRow} from "../tables/types/rows/latest-login-row.js"
import {AccountViaEmailRow} from "../tables/types/rows/account-via-email-row.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {AccountViaGoogleRow} from "../tables/types/rows/account-via-google-row.js"

export type UserTables = {
	account: DbbyTable<AccountRow>
	accountViaEmail: DbbyTable<AccountViaEmailRow>
	accountViaGoogle: DbbyTable<AccountViaGoogleRow>
	profile: DbbyTable<ProfileRow>
	latestLogin: DbbyTable<LatestLoginRow>
}
