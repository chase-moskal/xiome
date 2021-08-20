
import {parseQuery} from "../../../toolbox/parse-query.js"
import {makeAccessModel} from "../../../features/auth/aspects/users/models/access-model.js"

export async function loginWithLinkTokenOrUseExistingLogin({
		link, accessModel, afterLoginTokenProcessed = () => {},
	}: {
		link: string
		accessModel: ReturnType<typeof makeAccessModel>
		afterLoginTokenProcessed?: () => void
	}) {

	const {hash} = new URL(link)
	const {login} = parseQuery<{login: string}>(hash)

	if (login) {
		await accessModel.login(login)
		afterLoginTokenProcessed()
	}
	else
		await accessModel.useExistingLogin()
}
