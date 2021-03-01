
import {AccountRow} from "./account-row.js"
import {ProfileRow} from "./profile-row.js"
import {LatestLoginRow} from "./latest-login-row.js"
import {AccountViaEmailRow} from "./account-via-email-row.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {AccountViaGoogleRow} from "./account-via-google-row.js"

export type UserTables = {
	account: DbbyTable<AccountRow>
	accountViaEmail: DbbyTable<AccountViaEmailRow>
	accountViaGoogle: DbbyTable<AccountViaGoogleRow>
	profile: DbbyTable<ProfileRow>
	latestLogin: DbbyTable<LatestLoginRow>
}
