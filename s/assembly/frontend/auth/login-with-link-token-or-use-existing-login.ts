
import {makeAccessModel} from "../../../features/auth2/aspects/users/models/access-model.js"

export async function loginWithLinkTokenOrUseExistingLogin({link, authModel}: {
		link: string
		authModel: ReturnType<typeof makeAccessModel>
	}) {

	const {searchParams} = new URL(link)
	const loginToken = searchParams.get("login")

	if (loginToken)
		await authModel.login(loginToken)
	else
		await authModel.useExistingLogin()
}
