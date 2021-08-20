
import {parseQuery} from "../../../toolbox/parse-query.js"
import {makeAccessModel} from "../../../features/auth/aspects/users/models/access-model.js"

export async function loginWithLinkTokenOrUseExistingLogin({
		link, accessModel, onDone, onError,
	}: {
		link: string
		accessModel: ReturnType<typeof makeAccessModel>
		onDone: () => void
		onError: (error: Error) => void
	}) {

	const {hash} = new URL(link)
	const {login} = parseQuery<{login: string}>(hash)

	if (login) {
		try {
			await accessModel.login(login)
		}
		catch (error) {
			onError(error)
		}
		onDone()
	}
	else
		await accessModel.useExistingLogin()
}
