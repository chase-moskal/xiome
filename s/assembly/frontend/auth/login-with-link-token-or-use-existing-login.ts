
import {makeAccessModel} from "../../../features/auth/aspects/users/models/access-model.js"

export async function loginWithLinkTokenOrUseExistingLogin({link, accessModel}: {
		link: string
		accessModel: ReturnType<typeof makeAccessModel>
	}) {

	const {searchParams} = new URL(link)
	const loginToken = searchParams.get("login")

	if (loginToken)
		await accessModel.login(loginToken)
	else
		await accessModel.useExistingLogin()
}
