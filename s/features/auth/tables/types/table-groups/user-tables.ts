
import {AccountRow} from "../rows/account-row.js"
import {ProfileRow} from "../rows/profile-row.js"
import {LatestLoginRow} from "../rows/latest-login-row.js"
import {AccountViaEmailRow} from "../rows/account-via-email-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {AccountViaGoogleRow} from "../rows/account-via-google-row.js"

export type UserTables = {
	account: DbbyTable<AccountRow>
	accountViaEmail: DbbyTable<AccountViaEmailRow>
	accountViaGoogle: DbbyTable<AccountViaGoogleRow>
	profile: DbbyTable<ProfileRow>
	latestLogin: DbbyTable<LatestLoginRow>
}
