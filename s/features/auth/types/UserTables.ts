import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {LatestLoginRow} from "./LatestLoginRow.js"
import {ProfileRow} from "./ProfileRow.js"
import {AccountViaGoogleRow} from "./AccountViaGoogleRow.js"
import {AccountViaEmailRow} from "./AccountViaEmailRow.js"
import {AccountRow} from "./AccountRow.js"


export type UserTables = {
	account: DbbyTable<AccountRow>
	accountViaEmail: DbbyTable<AccountViaEmailRow>
	accountViaGoogle: DbbyTable<AccountViaGoogleRow>
	profile: DbbyTable<ProfileRow>
	latestLogin: DbbyTable<LatestLoginRow>
}
