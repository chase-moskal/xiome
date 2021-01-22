
import {makeAuthModel} from "../../features/auth/models/auth-model.js"

export async function loginWithTokenFromLink({link, authModel}: {
		link: string
		authModel: ReturnType<typeof makeAuthModel>
	}) {
	const {searchParams} = new URL(link)
	const loginToken = searchParams.get("login")
	if (loginToken) await authModel.login(loginToken)
}
