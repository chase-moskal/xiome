
// import {fetchUser} from "./user/fetch-user.js"
// import {fetchPermit} from "./user/fetch-permit.js"
// import {AuthTables} from "../../tables/types/auth-tables.js"
// import {concurrent} from "../../../../toolbox/concurrent.js"

// export async function fetchUserAndPermit({
// 			id_user,
// 			tables,
// 			generateNickname,
// 		}: {
// 			id_user: string
// 			tables: AuthTables
// 			generateNickname: () => string
// 		}) {
// 	return concurrent({
// 		user: await fetchUser({id_user, tables, generateNickname}),
// 		permit: await fetchPermit({id_user, tables}),
// 	})
// }
